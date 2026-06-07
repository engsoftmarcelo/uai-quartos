import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchRepublicDto {
  @ApiProperty({
    description: 'Latitude do ponto central da busca.',
    example: -19.9227,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude do ponto central da busca.',
    example: -43.9926,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiPropertyOptional({
    description: 'Raio operacional em metros.',
    example: 2500,
    default: 5000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(50000)
  radius?: number = 5000;

  @ApiPropertyOptional({ example: 1000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(100)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 500 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: true })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  privateBathroom?: boolean;

  @ApiPropertyOptional({
    description: 'Lista separada por virgulas: wifi,lavanderia.',
    example: 'wifi,lavanderia',
  })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional({ default: true })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  onlyAvailable?: boolean = true;

  @ApiPropertyOptional({ default: 24 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 24;
}
