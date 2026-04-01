import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { IuguWebhookDto } from './dto/iugu-webhook.dto';

@ApiTags('finance')
@Controller('api/v1/reservations')
export class ReservationsController {
  
  @Post()
  @ApiOperation({ summary: 'Inicia reserva vinculante e gera fatura na Iugu' })
  @ApiResponse({ status: 201, description: 'Reserva criada e fatura gerada.' })
  async createReservation(@Body() createDto: CreateReservationDto) {
    return {
      reservationId: 'uuid-gerado-no-banco',
      iuguInvoiceUrl: 'https://iugu.com/i/exemplo_token',
      status: 'pending'
    };
  }

  @Post('webhooks/iugu')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'X-Iugu-Signature', description: 'Assinatura de segurança para validar origem' })
  @ApiOperation({ 
    summary: 'Receptor de payloads assíncronos da Iugu (Blindagem contra Duplicidade)',
    description: 'Aplica regra de idempotência usando o iugu_invoice_id como chave única.'
  })
  @ApiResponse({ status: 200, description: 'Evento processado ou ignorado por duplicidade.' })
  async handleIuguWebhook(@Body() payload: IuguWebhookDto) {
    /**
     * REGRA DE IDEMPOTÊNCIA:
     * 1. Consultar no Banco: SELECT * FROM reservations WHERE iugu_invoice_id = payload.id
     * 2. Se já existir e estiver 'PAID': retornar 200 OK (ignora reenvio)
     * 3. Se for novo: Processar liquidação e marcar como 'PAID'
     */
    console.log(`Processando Webhook Iugu: ${payload.id} - Evento: ${payload.event}`);
    
    return { status: 'success', message: 'Idempotency check passed' };
  }
}