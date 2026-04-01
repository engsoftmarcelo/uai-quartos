import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { SearchRepublicDto } from './dto/search-republic.dto';
import { RepublicResponseDto } from './dto/republic-response.dto';

@ApiTags('properties')
@Controller('api/v1/properties')
export class RepublicsController {
  
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: 'Busca especializada de repúblicas por raio geoespacial',
    description: 'Tradução das diretrizes de busca em um andaime virtual resiliente utilizando PostGIS.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Listagem de anúncios formatada e imutável.',
    type: [RepublicResponseDto] 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erro de validação nos parâmetros geográficos.' 
  })
  async findAll(@Query() query: SearchRepublicDto): Promise<RepublicResponseDto[]> {
    /**
     * @todo Quinta-feira: Injetar RepublicsService para executar 
     * a query real no PostgreSQL usando ST_DWithin.
     */
    
    // Retorno de simulação (Mock) para validação no Swagger UI
    return [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Exemplo de República próxima à PUC Minas',
        price: 850.50,
        location: {
          lat: query.lat,
          lng: query.lng
        },
        distanceMetros: 120.5
      }
    ];
  }
}