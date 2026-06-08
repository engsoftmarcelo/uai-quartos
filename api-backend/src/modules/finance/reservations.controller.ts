import {
  Body,
  Controller,
  Headers,
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
import { ClicksignWebhookDto } from './dto/clicksign-webhook.dto';
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
  handleIuguWebhook(
    @Body() payload: IuguWebhookDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.financeService.handleIuguWebhook(
      payload,
      this.signatureFrom(headers, ['x-iugu-signature', 'webhook-signature']),
    );
  }

  @Post('webhooks/clicksign')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'X-Clicksign-Signature',
    description: 'Assinatura HMAC-SHA256 do parceiro juridico',
    required: true,
  })
  @ApiOperation({
    summary: 'Receptor de eventos juridicos da Clicksign.',
  })
  @ApiResponse({ status: 200, description: 'Evento processado ou ignorado.' })
  handleClicksignWebhook(
    @Body() payload: ClicksignWebhookDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.financeService.handleClicksignWebhook(
      payload,
      this.signatureFrom(headers, [
        'x-clicksign-signature',
        'clicksign-signature',
        'webhook-signature',
      ]),
    );
  }

  private signatureFrom(
    headers: Record<string, string | string[] | undefined>,
    names: string[],
  ): string | undefined {
    const normalizedHeaders = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
    );

    for (const name of names) {
      const value = normalizedHeaders[name.toLowerCase()];

      if (Array.isArray(value)) {
        return value[0];
      }

      if (typeof value === 'string') {
        return value;
      }
    }

    return undefined;
  }
}
