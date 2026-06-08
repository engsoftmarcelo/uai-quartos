import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LocationResponse {
  @ApiProperty({ example: -19.9227 })
  lat: number;

  @ApiProperty({ example: -43.9926 })
  lng: number;
}

class RoomSummaryResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Quarto individual mobiliado' })
  title: string;

  @ApiProperty({ example: 850.5 })
  basePrice: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiProperty({ example: false })
  privateBathroom: boolean;

  @ApiProperty({ example: 1 })
  capacity: number;
}

export class RepublicResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Republica UAI Centro' })
  name: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional({ example: 'Rua Padre Eustaquio, 1200' })
  address?: string | null;

  @ApiPropertyOptional({ example: 'Coracao Eucaristico' })
  neighborhood?: string | null;

  @ApiPropertyOptional({ example: 'Belo Horizonte' })
  city?: string | null;

  @ApiPropertyOptional({ example: 'MG' })
  state?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/republica.jpg' })
  imageUrl?: string | null;

  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;

  @ApiProperty({ example: 850.5 })
  minPrice: number;

  @ApiProperty({ example: 3 })
  availableRooms: number;

  @ApiProperty({ example: ['wifi', 'lavanderia'] })
  amenities: string[];

  @ApiProperty({ type: [RoomSummaryResponse] })
  rooms: RoomSummaryResponse[];

  @ApiPropertyOptional({ example: 450 })
  distanceMetros?: number;
}
