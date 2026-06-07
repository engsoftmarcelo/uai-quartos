import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreateRepublicDto } from '../dto/create-republic.dto';
import { PropertyMediaUploadDto } from '../dto/property-media-upload.dto';
import { RepublicResponseDto } from '../dto/republic-response.dto';
import { SearchRepublicDto } from '../dto/search-republic.dto';
import { UpdateRepublicDto } from '../dto/update-republic.dto';
import {
  Coordinates,
  IRepublicsRepository,
  MediaUploadIntent,
  PropertyAccessScope,
} from '../interfaces/republics.repository.port';

interface PropertyRow {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  image_url: string | null;
  lat: number;
  lng: number;
  distance_metros: number | null;
  min_price: number;
  available_rooms: number;
  amenities: string[] | null;
  rooms: Array<{
    title: string;
    basePrice: number;
    isAvailable: boolean;
    privateBathroom: boolean;
    capacity: number;
  }> | null;
}

@Injectable()
export class PrismaRepublicsAdapter implements IRepublicsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findNearby(query: SearchRepublicDto): Promise<RepublicResponseDto[]> {
    const amenities = this.normalizeAmenities(query.amenities);
    const where = this.buildSearchFilters(query, amenities);
    const rows = await this.fetchPropertyRows({
      where,
      distancePoint: { lat: query.lat, lng: query.lng },
      limit: query.limit ?? 24,
    });

    return rows.map((row) => this.mapRow(row));
  }

  async findById(id: string): Promise<RepublicResponseDto | null> {
    const rows = await this.fetchPropertyRows({
      where: [Prisma.sql`r.id = ${id}`, Prisma.sql`r.deleted_at IS NULL`],
      limit: 1,
    });

    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async findOwned(scope: PropertyAccessScope): Promise<RepublicResponseDto[]> {
    const where =
      scope.role === Role.ADMIN
        ? [Prisma.sql`r.deleted_at IS NULL`]
        : [
            Prisma.sql`r.owner_id = ${scope.userId}`,
            Prisma.sql`r.deleted_at IS NULL`,
          ];
    const rows = await this.fetchPropertyRows({ where, limit: 100 });

    return rows.map((row) => this.mapRow(row));
  }

  async create(
    ownerId: string,
    data: CreateRepublicDto,
    coordinates: Coordinates,
  ): Promise<RepublicResponseDto> {
    const republic = await this.prisma.$transaction(async (tx) => {
      const created = await tx.republic.create({
        data: {
          ownerId,
          name: data.name.trim(),
          description: data.description?.trim(),
          address: data.address?.trim(),
          neighborhood: data.neighborhood?.trim(),
          city: data.city?.trim() ?? 'Belo Horizonte',
          state: data.state?.trim() ?? 'MG',
          postalCode: data.postalCode?.trim(),
          imageUrl: data.imageUrl?.trim(),
          rooms: {
            create: data.rooms.map((room) => ({
              title: room.title.trim(),
              basePrice: new Prisma.Decimal(room.basePrice),
              isAvailable: room.isAvailable ?? true,
              privateBathroom: room.privateBathroom ?? false,
              capacity: room.capacity ?? 1,
              areaM2:
                typeof room.areaM2 === 'number'
                  ? new Prisma.Decimal(room.areaM2)
                  : undefined,
              amenities: {
                connectOrCreate: this.normalizeAmenities(room.amenities).map(
                  (name) => ({
                    where: { name },
                    create: { name },
                  }),
                ),
              },
            })),
          },
        },
      });

      await this.setLocation(tx, created.id, coordinates);
      return created;
    });

    const response = await this.findById(republic.id);

    if (!response) {
      throw new NotFoundException('Republica criada nao encontrada.');
    }

    return response;
  }

  async update(
    id: string,
    scope: PropertyAccessScope,
    data: UpdateRepublicDto,
    coordinates?: Coordinates,
  ): Promise<RepublicResponseDto> {
    await this.assertWritable(id, scope);

    await this.prisma.$transaction(async (tx) => {
      await tx.republic.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          description: data.description?.trim(),
          address: data.address?.trim(),
          neighborhood: data.neighborhood?.trim(),
          city: data.city?.trim(),
          state: data.state?.trim(),
          postalCode: data.postalCode?.trim(),
          imageUrl: data.imageUrl?.trim(),
        },
      });

      if (coordinates) {
        await this.setLocation(tx, id, coordinates);
      }
    });

    const response = await this.findById(id);

    if (!response) {
      throw new NotFoundException('Republica nao encontrada.');
    }

    return response;
  }

  async softDelete(id: string, scope: PropertyAccessScope): Promise<void> {
    await this.assertWritable(id, scope);

    await this.prisma.$transaction(async (tx) => {
      await tx.republic.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      await tx.room.updateMany({
        where: { republicId: id },
        data: { isAvailable: false },
      });
    });
  }

  async createMediaUploadIntent(
    id: string,
    scope: PropertyAccessScope,
    data: PropertyMediaUploadDto,
  ): Promise<MediaUploadIntent> {
    await this.assertWritable(id, scope);

    const extension = data.filename
      .split('.')
      .pop()
      ?.replace(/[^a-z0-9]/gi, '');
    const suffix = extension ? `.${extension.toLowerCase()}` : '';
    const storageKey = `properties/${id}/${randomUUID()}${suffix}`;
    const mediaBaseUrl =
      process.env.PROPERTY_MEDIA_UPLOAD_BASE_URL?.replace(/\/$/, '') ??
      'https://storage.uai-quartos.local';
    const imageUrl = `${mediaBaseUrl}/${storageKey}`;

    const photo = await this.prisma.$transaction(async (tx) => {
      const createdPhoto = await tx.propertyPhoto.create({
        data: {
          republicId: id,
          storageKey,
          imageUrl,
          altText: data.filename,
        },
      });

      await tx.republic.updateMany({
        where: { id, imageUrl: null },
        data: { imageUrl },
      });

      return createdPhoto;
    });

    return {
      photoId: photo.id,
      method: 'PUT',
      uploadUrl: imageUrl,
      storageKey,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }

  private buildSearchFilters(
    query: SearchRepublicDto,
    amenities: string[],
  ): Prisma.Sql[] {
    const radius = query.radius ?? 5000;
    const filters: Prisma.Sql[] = [
      Prisma.sql`r.deleted_at IS NULL`,
      Prisma.sql`r.location IS NOT NULL`,
      Prisma.sql`ST_DWithin(r.location::geography, ST_SetSRID(ST_MakePoint(${query.lng}, ${query.lat}), 4326)::geography, ${radius})`,
    ];

    if (query.onlyAvailable ?? true) {
      filters.push(
        Prisma.sql`EXISTS (SELECT 1 FROM rooms rr WHERE rr.republic_id = r.id AND rr.is_available = true)`,
      );
    }

    if (typeof query.minPrice === 'number') {
      filters.push(
        Prisma.sql`EXISTS (SELECT 1 FROM rooms rr WHERE rr.republic_id = r.id AND rr.base_price >= ${query.minPrice})`,
      );
    }

    if (typeof query.maxPrice === 'number') {
      filters.push(
        Prisma.sql`EXISTS (SELECT 1 FROM rooms rr WHERE rr.republic_id = r.id AND rr.base_price <= ${query.maxPrice})`,
      );
    }

    if (typeof query.privateBathroom === 'boolean') {
      filters.push(
        Prisma.sql`EXISTS (SELECT 1 FROM rooms rr WHERE rr.republic_id = r.id AND rr.private_bathroom = ${query.privateBathroom})`,
      );
    }

    if (amenities.length) {
      filters.push(
        Prisma.sql`(
          SELECT COUNT(DISTINCT lower(a.name))
          FROM rooms rr
          JOIN "_AmenityToRoom" ar ON ar."B" = rr.id
          JOIN amenities a ON a.id = ar."A"
          WHERE rr.republic_id = r.id AND lower(a.name) IN (${Prisma.join(
            amenities,
          )})
        ) = ${amenities.length}`,
      );
    }

    return filters;
  }

  private async fetchPropertyRows(options: {
    where: Prisma.Sql[];
    distancePoint?: Coordinates;
    limit: number;
  }): Promise<PropertyRow[]> {
    const whereSql = Prisma.join(options.where, ' AND ');
    const distanceSql = options.distancePoint
      ? Prisma.sql`ST_Distance(r.location::geography, ST_SetSRID(ST_MakePoint(${options.distancePoint.lng}, ${options.distancePoint.lat}), 4326)::geography)::float`
      : Prisma.sql`NULL::float`;
    const orderSql = options.distancePoint
      ? Prisma.sql`distance_metros ASC, min_price ASC`
      : Prisma.sql`r.created_at DESC`;

    return this.prisma.$queryRaw<PropertyRow[]>`
      SELECT
        r.id,
        r.name,
        r.description,
        r.address,
        r.neighborhood,
        r.city,
        r.state,
        r.image_url,
        ST_Y(r.location::geometry)::float AS lat,
        ST_X(r.location::geometry)::float AS lng,
        ${distanceSql} AS distance_metros,
        COALESCE(MIN(room.base_price)::float, 0) AS min_price,
        COALESCE(COUNT(DISTINCT room.id) FILTER (WHERE room.is_available = true), 0)::int AS available_rooms,
        COALESCE(
          array_agg(DISTINCT amenity.name) FILTER (WHERE amenity.id IS NOT NULL),
          ARRAY[]::text[]
        ) AS amenities,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object(
            'title', room.title,
            'basePrice', room.base_price::float,
            'isAvailable', room.is_available,
            'privateBathroom', room.private_bathroom,
            'capacity', room.capacity
          )) FILTER (WHERE room.id IS NOT NULL),
          '[]'::jsonb
        ) AS rooms
      FROM republics r
      LEFT JOIN rooms room ON room.republic_id = r.id
      LEFT JOIN "_AmenityToRoom" room_amenity ON room_amenity."B" = room.id
      LEFT JOIN amenities amenity ON amenity.id = room_amenity."A"
      WHERE ${whereSql}
      GROUP BY r.id
      ORDER BY ${orderSql}
      LIMIT ${options.limit}
    `;
  }

  private mapRow(row: PropertyRow): RepublicResponseDto {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      address: row.address,
      neighborhood: row.neighborhood,
      city: row.city,
      state: row.state,
      imageUrl: row.image_url,
      location: {
        lat: Number(row.lat),
        lng: Number(row.lng),
      },
      minPrice: Number(row.min_price),
      availableRooms: Number(row.available_rooms),
      amenities: row.amenities ?? [],
      rooms: (row.rooms ?? []).map((room) => ({
        title: room.title,
        basePrice: Number(room.basePrice),
        isAvailable: Boolean(room.isAvailable),
        privateBathroom: Boolean(room.privateBathroom),
        capacity: Number(room.capacity),
      })),
      distanceMetros:
        typeof row.distance_metros === 'number'
          ? Math.round(row.distance_metros)
          : undefined,
    };
  }

  private normalizeAmenities(input?: string[] | string): string[] {
    const values = Array.isArray(input) ? input : (input?.split(',') ?? []);

    return Array.from(
      new Set(
        values
          .map((value) => value.trim().toLowerCase())
          .filter((value) => value.length > 0),
      ),
    );
  }

  private async assertWritable(
    id: string,
    scope: PropertyAccessScope,
  ): Promise<void> {
    const property = await this.prisma.republic.findFirst({
      where: { id, deletedAt: null },
      select: { ownerId: true },
    });

    if (!property) {
      throw new NotFoundException('Republica nao encontrada.');
    }

    if (scope.role !== Role.ADMIN && property.ownerId !== scope.userId) {
      throw new ForbiddenException('Acesso negado para esta propriedade.');
    }
  }

  private async setLocation(
    tx: Prisma.TransactionClient,
    id: string,
    coordinates: Coordinates,
  ): Promise<void> {
    await tx.$executeRaw`
      UPDATE republics
      SET location = ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)
      WHERE id = ${id}
    `;
  }
}
