import { ApiProperty } from '@nestjs/swagger';
import { KycDocumentType } from '@prisma/client';
import {
  IsEnum,
  IsMimeType,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RequestKycUploadDto {
  @ApiProperty({ enum: KycDocumentType })
  @IsEnum(KycDocumentType)
  documentType: KycDocumentType;

  @ApiProperty({ example: 'rg-frente.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsMimeType()
  contentType: string;
}
