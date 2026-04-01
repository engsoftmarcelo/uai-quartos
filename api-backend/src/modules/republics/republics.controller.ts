import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
} from '@nestjs/swagger';
import { SearchRepublicDto } from './dto/search-republic.dto';
import { RepublicResponseDto } from './dto/republic-response.dto';
import { RepublicsService } from './republics.service';

@ApiTags('properties') // Categoria no Swagger
@Controller('api/v1/properties') // Endpoint oficial do ecossistema
export class RepublicsController {
  
  // REGRA DE OURO: Injeção do Service (O Chef da Cozinha)
  constructor(private readonly republicsService: RepublicsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: 'Busca especializada de repúblicas por raio geoespacial',
    description: 'Endpoint blindado que delega o processamento vetorial (PostGIS) ao domínio de negócio.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Listagem de anúncios processada e formatada.',
    type: [RepublicResponseDto] 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parâmetros de busca (lat/lng/radius) inválidos.' 
  })
  async findAll(@Query() query: SearchRepublicDto): Promise<RepublicResponseDto[]> {
    /**
     * O "Garçom" (Controller) apenas recebe o pedido (Query)
     * e o entrega para o "Chef" (Service) processar.
     */
    return this.republicsService.findNearby(query);
  }
}