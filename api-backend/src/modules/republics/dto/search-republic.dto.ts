import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRepublicDto {
  @ApiProperty({
    description: 'Latitude da localização central (ex: Campus PUC)',
    example: -19.9227,
  })
  @Type(() => Number) // Garante a conversão de string para number no Query Param
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude da localização central',
    example: -43.9926,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({
    description: 'Raio dinâmico operacional em metros',
    example: 5000,
    required: false,
    default: 5000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(100)  // Mínimo 100 metros
  @Max(50000) // Máximo 50km para evitar sobrecarga
  radius?: number = 5000;
}