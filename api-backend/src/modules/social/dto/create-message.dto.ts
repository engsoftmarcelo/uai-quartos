import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Oi! O quarto ainda esta disponivel?' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string;

  @ApiPropertyOptional({
    description: 'Chave idempotente enviada pelo cliente/socket.',
    example: 'evt_123',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  eventId?: string;
}

export class SendMessageDto extends CreateMessageDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4')
  conversationId: string;
}
