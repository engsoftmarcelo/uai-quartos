import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { IuguWebhookDto } from './dto/iugu-webhook.dto';
import { FinanceService } from './finance.service';

@ApiTags('finance')
@Controller('api/v1/reservations')
export class ReservationsController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inicia reserva vinculante e gera fatura sandbox.' })
  @ApiResponse({ status: 201, description: 'Reserva criada e fatura gerada.' })
  createReservation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createDto: CreateReservationDto,
  ) {
    return this.financeService.createReservation(user, createDto);
  }

  @Post('webhooks/iugu')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'X-Iugu-Signature',
    description: 'Assinatura de seguranca para validar origem',
    required: false,
  })
  @ApiOperation({
    summary: 'Receptor de payloads assincronos da Iugu.',
    description:
      'Aplica idempotencia usando iugu_invoice_id como chave unica da reserva.',
  })
  @ApiResponse({ status: 200, description: 'Evento processado ou ignorado.' })
  handleIuguWebhook(@Body() payload: IuguWebhookDto) {
    return this.financeService.handleIuguWebhook(payload);
  }
}
