import { ApiProperty } from '@nestjs/swagger';

// Sub-esqueleto para as coordenadas formatadas
class LocationResponse {
  @ApiProperty({ example: -19.9227 })
  lat: number;

  @ApiProperty({ example: -43.9926 })
  lng: number;
}

export class RepublicResponseDto {
  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'UUID único da república (Imutável)' 
  })
  id: string;

  @ApiProperty({ example: 'República UAI Centro', description: 'Nome da acomodação' })
  name: string;

  @ApiProperty({ example: 950.50, description: 'Preço base formatado' })
  price: number;

  @ApiProperty({ type: LocationResponse, description: 'Coordenadas geográficas processadas' })
  location: LocationResponse;

  @ApiProperty({ 
    example: 450.5, 
    description: 'Distância calculada em metros em relação ao ponto de busca' 
  })
  distanceMetros?: number;
}