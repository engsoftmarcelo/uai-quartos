import { Role } from '@prisma/client';
import { CreateRepublicDto } from '../dto/create-republic.dto';
import { PropertyMediaUploadDto } from '../dto/property-media-upload.dto';
import { RepublicResponseDto } from '../dto/republic-response.dto';
import { SearchRepublicDto } from '../dto/search-republic.dto';
import { UpdateRepublicDto } from '../dto/update-republic.dto';

export const REPUBLICS_REPOSITORY_PORT = 'REPUBLICS_REPOSITORY_PORT';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PropertyAccessScope {
  userId: string;
  role: Role;
}

export interface MediaUploadIntent {
  photoId: string;
  method: 'PUT';
  uploadUrl: string;
  storageKey: string;
  expiresAt: Date;
}

export interface IRepublicsRepository {
  findNearby(query: SearchRepublicDto): Promise<RepublicResponseDto[]>;
  findById(id: string): Promise<RepublicResponseDto | null>;
  findOwned(scope: PropertyAccessScope): Promise<RepublicResponseDto[]>;
  create(
    ownerId: string,
    data: CreateRepublicDto,
    coordinates: Coordinates,
  ): Promise<RepublicResponseDto>;
  update(
    id: string,
    scope: PropertyAccessScope,
    data: UpdateRepublicDto,
    coordinates?: Coordinates,
  ): Promise<RepublicResponseDto>;
  softDelete(id: string, scope: PropertyAccessScope): Promise<void>;
  createMediaUploadIntent(
    id: string,
    scope: PropertyAccessScope,
    data: PropertyMediaUploadDto,
  ): Promise<MediaUploadIntent>;
}
