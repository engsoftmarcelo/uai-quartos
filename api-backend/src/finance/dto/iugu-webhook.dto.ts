import { ApiProperty } from '@nestjs/swagger';

export class IuguWebhookDto {
  @ApiProperty({ example: 'invoice_id_123' })
  id: string;

  @ApiProperty({ example: 'paid', description: 'Status da transação' })
  event: string;

  @ApiProperty({ description: 'Dados extras da transação' })
  data: any;
}