import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ClicksignWebhookDto {
  @ApiProperty({ example: 'clicksign-doc-123' })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ example: 'document.signed' })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiPropertyOptional({ example: 'doc-key-123' })
  @IsOptional()
  @IsString()
  documentKey?: string;

  @ApiPropertyOptional({ example: 'estudante@pucminas.br' })
  @IsOptional()
  @IsString()
  signerEmail?: string;

  @ApiPropertyOptional({ description: 'Dados extras do parceiro juridico.' })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}
