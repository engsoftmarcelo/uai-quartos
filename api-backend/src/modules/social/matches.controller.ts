import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { SocialService } from './social.service';

@ApiTags('social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class MatchesController {
  constructor(private readonly socialService: SocialService) {}

  @Get('social/profile')
  @ApiOperation({ summary: 'Retorna o perfil sociocultural autenticado.' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.socialService.getProfile(user);
  }

  @Put('social/profile')
  @ApiOperation({ summary: 'Atualiza o perfil e vetor de convivencia.' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UserProfileDto,
  ) {
    return this.socialService.updateProfile(user, dto);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Calcula afinidade com republicas ativas.' })
  @ApiResponse({ status: 200, description: 'Scores de afinidade calculados.' })
  calculateMatches(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: MatchQueryDto,
  ) {
    return this.socialService.calculateMatches(user, query);
  }

  @Post('conversations')
  @ApiOperation({
    summary: 'Inicia ou recupera conversa segura por republica.',
  })
  createConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateConversationDto,
  ) {
    return this.socialService.createConversation(user, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Lista conversas do usuario autenticado.' })
  listConversations(@CurrentUser() user: AuthenticatedUser) {
    return this.socialService.listConversations(user);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Lista historico relacional de mensagens.' })
  listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
  ) {
    return this.socialService.listMessages(user, conversationId);
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Envia mensagem por fallback HTTP idempotente.' })
  createMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.socialService.createMessage(user, conversationId, dto);
  }
}
