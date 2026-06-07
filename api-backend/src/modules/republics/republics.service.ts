import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { PropertyMediaUploadDto } from './dto/property-media-upload.dto';
import { SearchRepublicDto } from './dto/search-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';
import { GeocodingService } from './geocoding.service';
import { REPUBLICS_REPOSITORY_PORT } from './interfaces/republics.repository.port';
import type { IRepublicsRepository } from './interfaces/republics.repository.port';

@Injectable()
export class RepublicsService {
  constructor(
    @Inject(REPUBLICS_REPOSITORY_PORT)
    private readonly repository: IRepublicsRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  findNearby(query: SearchRepublicDto) {
    return this.repository.findNearby(query);
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  findMine(user: AuthenticatedUser) {
    return this.repository.findOwned({
      userId: user.id,
      role: user.role,
    });
  }

  async create(user: AuthenticatedUser, dto: CreateRepublicDto) {
    const coordinates = await this.geocodingService.resolve(dto);
    return this.repository.create(user.id, dto, coordinates);
  }

  async update(id: string, user: AuthenticatedUser, dto: UpdateRepublicDto) {
    const shouldRecalculateLocation =
      typeof dto.lat === 'number' ||
      typeof dto.lng === 'number' ||
      typeof dto.address === 'string' ||
      typeof dto.neighborhood === 'string' ||
      typeof dto.city === 'string';
    const coordinates = shouldRecalculateLocation
      ? await this.geocodingService.resolve(dto)
      : undefined;

    return this.repository.update(
      id,
      { userId: user.id, role: user.role },
      dto,
      coordinates,
    );
  }

  remove(id: string, user: AuthenticatedUser) {
    return this.repository.softDelete(id, {
      userId: user.id,
      role: user.role,
    });
  }

  createMediaUploadIntent(
    id: string,
    user: AuthenticatedUser,
    dto: PropertyMediaUploadDto,
  ) {
    return this.repository.createMediaUploadIntent(
      id,
      { userId: user.id, role: user.role },
      dto,
    );
  }

  canManage(user: AuthenticatedUser): boolean {
    return user.role === Role.LANDLORD || user.role === Role.ADMIN;
  }
}
