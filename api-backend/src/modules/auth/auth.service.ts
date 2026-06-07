import { randomBytes, createHash } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PublicUser, UsersService } from '../users/users.service';
import { jwtAccessTtlSeconds, refreshTokenDays } from './auth.constants';
import { JwtPayload, RequestMetadata } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const passwordHash = await this.passwordService.hash(registerDto.password);
    const user = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      role: registerDto.role,
      password: passwordHash,
    });

    return this.createSession(user, metadata);
  }

  async login(
    loginDto: LoginDto,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const user = await this.usersService.findActiveByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais invalidas para o portal UAI.',
      );
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Credenciais invalidas para o portal UAI.',
      );
    }

    return this.createSession(UsersService.toPublicUser(user), metadata);
  }

  async refreshTokens(
    refreshToken: string,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const currentSession = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash },
      include: { user: true },
    });

    if (!currentSession) {
      throw new UnauthorizedException('Refresh token invalido.');
    }

    if (currentSession.revokedAt) {
      await this.revokeAllUserSessions(currentSession.userId);
      throw new UnauthorizedException('Reuso de refresh token detectado.');
    }

    if (
      currentSession.expiresAt <= new Date() ||
      currentSession.user.deletedAt
    ) {
      await this.revokeSession(currentSession.id);
      throw new UnauthorizedException('Refresh token expirado.');
    }

    const nextRefreshToken = this.generateRefreshToken();
    const nextRefreshTokenHash = this.hashRefreshToken(nextRefreshToken);
    const nextRefreshTokenExpiresAt = this.getRefreshExpiration();

    const nextSession = await this.prisma.$transaction(async (tx) => {
      await tx.authSession.update({
        where: { id: currentSession.id },
        data: {
          revokedAt: new Date(),
          replacedByHash: nextRefreshTokenHash,
        },
      });

      return tx.authSession.create({
        data: {
          userId: currentSession.userId,
          refreshTokenHash: nextRefreshTokenHash,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
          expiresAt: nextRefreshTokenExpiresAt,
        },
      });
    });

    const publicUser = UsersService.toPublicUser(currentSession.user);
    const accessToken = await this.signAccessToken(publicUser, nextSession.id);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      refreshTokenExpiresAt: nextRefreshTokenExpiresAt,
      user: publicUser,
    };
  }

  async revokeRefreshToken(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const session = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash },
    });

    if (session && !session.revokedAt) {
      await this.revokeSession(session.id);
    }
  }

  private async createSession(
    user: PublicUser,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = this.getRefreshExpiration();

    const session = await this.prisma.authSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    const accessToken = await this.signAccessToken(user, session.id);

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      user,
    };
  }

  private signAccessToken(
    user: PublicUser,
    sessionId: string,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
      sid: sessionId,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: jwtAccessTtlSeconds,
    });
  }

  private async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('base64url');
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private getRefreshExpiration(): Date {
    return new Date(Date.now() + refreshTokenDays * 24 * 60 * 60 * 1000);
  }
}
