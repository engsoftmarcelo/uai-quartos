import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class IuguWebhookDto {
  @ApiProperty({ example: 'sandbox-invoice-id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'invoice.paid', description: 'Evento da transacao.' })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiPropertyOptional({ description: 'Dados extras da transacao.' })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}
