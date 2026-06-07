import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../core/prisma/prisma.service';
import { jwtSecret } from '../auth/auth.constants';
import type { AuthenticatedUser, JwtPayload } from '../auth/auth.types';
import { UsersService } from '../users/users.service';
import { SendMessageDto } from './dto/create-message.dto';
import { SocialService } from './social.service';

type AuthenticatedSocket = Socket;
type SocketData = {
  user?: AuthenticatedUser;
};

@WebSocketGateway({
  cors: {
    origin: (
      process.env.FRONTEND_URLS ??
      'http://localhost:3001,http://localhost:3000,http://localhost:3003'
    )
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  },
  namespace: 'chat',
})
export class SocialGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly socialService: SocialService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const user = await this.authenticate(client);
      this.setSocketUser(client, user);
      await client.join(`user:${user.id}`);
      client.emit('connection:ready', { userId: user.id });
    } catch {
      client.emit('connection:rejected', { reason: 'unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.getSocketData(client).user?.id;

    if (userId) {
      this.server.to(`user:${userId}`).emit('presence:left', { userId });
    }
  }

  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId?: string },
  ) {
    const user = this.requireUser(client);
    const conversationId = this.requireConversationId(payload.conversationId);
    await this.socialService.assertConversationParticipant(
      user,
      conversationId,
    );
    await client.join(this.conversationRoom(conversationId));
    client.emit('conversation:joined', { conversationId });

    return { conversationId };
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const user = this.requireUser(client);
    const message = await this.socialService.createMessage(
      user,
      this.requireConversationId(payload.conversationId),
      payload,
    );
    const event = {
      conversationId: payload.conversationId,
      message,
    };

    this.server
      .to(this.conversationRoom(payload.conversationId))
      .emit('message:new', event);

    return event;
  }

  private async authenticate(client: Socket): Promise<AuthenticatedUser> {
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Token ausente.');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: jwtSecret,
    });
    const [user, session] = await Promise.all([
      this.usersService.findActiveById(payload.sub),
      this.prisma.authSession.findFirst({
        where: {
          id: payload.sid,
          userId: payload.sub,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    if (!user || !session) {
      throw new WsException('Sessao invalida.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      kycStatus: user.kycStatus,
      sessionId: payload.sid,
    };
  }

  private extractToken(client: Socket): string | null {
    const auth = client.handshake.auth as Record<string, unknown>;
    const authToken = auth.token;

    if (typeof authToken === 'string') {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;

    if (typeof authorization === 'string') {
      return authorization.replace(/^Bearer\s+/i, '');
    }

    return null;
  }

  private requireUser(client: AuthenticatedSocket): AuthenticatedUser {
    const user = this.getSocketData(client).user;

    if (!user) {
      throw new WsException('Socket nao autenticado.');
    }

    return user;
  }

  private setSocketUser(client: Socket, user: AuthenticatedUser) {
    this.getSocketData(client).user = user;
  }

  private getSocketData(client: Socket): SocketData {
    return client.data as unknown as SocketData;
  }

  private requireConversationId(conversationId?: string): string {
    if (!conversationId) {
      throw new WsException('conversationId obrigatorio.');
    }

    return conversationId;
  }

  private conversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }
}
