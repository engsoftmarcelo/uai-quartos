import { Injectable, Inject } from '@nestjs/common';
import { REPUBLICS_REPOSITORY_PORT } from './interfaces/republics.repository.port';
import type { IRepublicsRepository } from './interfaces/republics.repository.port'; // <-- ADICIONE 'type' AQUI
import { SearchRepublicDto } from './dto/search-republic.dto';

@Injectable()
export class RepublicsService {
  // Injeta a Interface (Porta), nunca a implementação direta
  constructor(
    @Inject(REPUBLICS_REPOSITORY_PORT) 
    private readonly repository: IRepublicsRepository
  ) {}

  async findNearby(query: SearchRepublicDto) {
    // Regras de negócio puras (validações extras, cálculos financeiros) entrariam aqui
    return this.repository.findNearby(query);
  }
}