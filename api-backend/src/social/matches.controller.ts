import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('social')
@Controller('api/v1/matches')
export class MatchesController {
  
  @Post()
  @ApiOperation({ 
    summary: 'Calcula afinidade heurística entre estudante e república',
    description: 'Processamento analítico das variáveis de rotina de vida habitacional.'
  })
  @ApiResponse({ status: 200, description: 'Score de afinidade calculado com sucesso.' })
  async calculate(@Body() profile: UserProfileDto) {
    // Lógica de cálculo heurístico será implementada no Service
    return {
      score: 85,
      compatibility: 'Alta',
      factors: ['Compatibilidade de silêncio ativa', 'Ambiente livre de fumo']
    };
  }
}