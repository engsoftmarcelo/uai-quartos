import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SearchRepublicDto } from './dto/search-republic.dto';
import { RepublicResponseDto } from './dto/republic-response.dto';

@Injectable()
export class RepublicsService {
  constructor(private prisma: PrismaService) {}

  async findNearby(query: SearchRepublicDto): Promise<RepublicResponseDto[]> {
    const { lat, lng, radius } = query;

    // Execução da Query Heurística Geográfica (PostGIS)
    // Usamos $queryRaw porque o Prisma não tem suporte nativo total para tipos espaciais
    const republics = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, price, 
             ST_X(location::geometry) as lng, 
             ST_Y(location::geometry) as lat,
             ST_Distance(location, ST_MakePoint(${lng}, ${lat})::geography) as distance
      FROM "Republic"
      WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radius})
      ORDER BY distance ASC
    `;

    return republics.map(repo => ({
      id: repo.id,
      name: repo.name,
      price: Number(repo.price),
      location: { lat: repo.lat, lng: repo.lng },
      distanceMetros: Math.round(repo.distance)
    }));
  }
}