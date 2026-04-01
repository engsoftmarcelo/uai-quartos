import { SearchRepublicDto } from '../dto/search-republic.dto';
import { RepublicResponseDto } from '../dto/republic-response.dto';

// Token exclusivo para a Injeção de Dependência do NestJS
export const REPUBLICS_REPOSITORY_PORT = 'REPUBLICS_REPOSITORY_PORT';

export interface IRepublicsRepository {
  findNearby(query: SearchRepublicDto): Promise<RepublicResponseDto[]>;
  // Futuramente: create(data: any): Promise<any>;
}