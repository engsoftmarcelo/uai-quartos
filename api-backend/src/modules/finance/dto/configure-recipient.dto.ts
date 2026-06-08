import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ConfigureRecipientDto {
  @ApiProperty({ example: 'Republica UAI Ltda' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  legalName: string;

  @ApiProperty({ example: '12345678000199' })
  @IsString()
  @MinLength(11)
  @MaxLength(18)
  document: string;

  @ApiPropertyOptional({ example: 'iugu-recipient-abc123' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerAccountId?: string;

  @ApiPropertyOptional({ example: '001' })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  bankCode?: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  agency?: string;

  @ApiPropertyOptional({ example: '987654-0' })
  @IsOptional()
  @IsString()
  @MaxLength(24)
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'financeiro@republica.com.br' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  pixKey?: string;
}
