import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Quarto individual mobiliado' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 850.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(100)
  basePrice: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  privateBathroom?: boolean = false;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  capacity?: number = 1;

  @ApiPropertyOptional({ example: 10.5 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(80)
  areaM2?: number;

  @ApiPropertyOptional({ example: ['wifi', 'lavanderia'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(16)
  @IsString({ each: true })
  amenities?: string[];
}

export class CreateRepublicDto {
  @ApiProperty({ example: 'Republica UAI Coracao Eucaristico' })
  @IsString()
  @MaxLength(140)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Rua Padre Eustaquio, 1200' })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  address?: string;

  @ApiPropertyOptional({ example: 'Coracao Eucaristico' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  neighborhood?: string;

  @ApiPropertyOptional({ example: 'Belo Horizonte' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ example: 'MG', default: 'MG' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string = 'MG';

  @ApiPropertyOptional({ example: '30535-610' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  postalCode?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo.jpg' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiPropertyOptional({ example: -19.9227 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({ example: -43.9926 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiProperty({ type: [CreateRoomDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  rooms: CreateRoomDto[];
}
