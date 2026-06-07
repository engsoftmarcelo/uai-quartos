import { BadRequestException, Injectable } from '@nestjs/common';
import { Coordinates } from './interfaces/republics.repository.port';

interface GeocodingInput {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
}

interface GoogleGeocodingResponse {
  results?: Array<{
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
  status?: string;
}

const localBhCoordinates: Array<{ matcher: RegExp; coordinates: Coordinates }> =
  [
    {
      matcher: /puc|coracao eucaristico|cora[çc][aã]o eucar/i,
      coordinates: { lat: -19.9236, lng: -43.9928 },
    },
    {
      matcher: /ufmg|pampulha/i,
      coordinates: { lat: -19.8697, lng: -43.9643 },
    },
    {
      matcher: /savassi|funcionarios/i,
      coordinates: { lat: -19.9372, lng: -43.9339 },
    },
    {
      matcher: /centro|pra[çc]a sete/i,
      coordinates: { lat: -19.9191, lng: -43.9386 },
    },
  ];

@Injectable()
export class GeocodingService {
  async resolve(input: GeocodingInput): Promise<Coordinates> {
    if (this.hasManualCoordinates(input)) {
      return { lat: input.lat, lng: input.lng };
    }

    const address = this.buildAddress(input);

    if (!address) {
      throw new BadRequestException(
        'Informe latitude/longitude ou um endereco para geocodificar.',
      );
    }

    const localCoordinates = this.findLocalFallback(address);

    if (localCoordinates) {
      return localCoordinates;
    }

    const googleCoordinates = await this.resolveWithGoogleMaps(address);

    if (googleCoordinates) {
      return googleCoordinates;
    }

    throw new BadRequestException(
      'Nao foi possivel geocodificar o endereco. Informe latitude e longitude manualmente.',
    );
  }

  private hasManualCoordinates(
    input: GeocodingInput,
  ): input is GeocodingInput & Coordinates {
    return typeof input.lat === 'number' && typeof input.lng === 'number';
  }

  private buildAddress(input: GeocodingInput): string {
    return [
      input.address,
      input.neighborhood,
      input.city ?? 'Belo Horizonte',
      input.state ?? 'MG',
      'Brasil',
    ]
      .filter(Boolean)
      .join(', ');
  }

  private findLocalFallback(address: string): Coordinates | null {
    return (
      localBhCoordinates.find(({ matcher }) => matcher.test(address))
        ?.coordinates ?? null
    );
  }

  private async resolveWithGoogleMaps(
    address: string,
  ): Promise<Coordinates | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return null;
    }

    const params = new URLSearchParams({ address, key: apiKey });
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
    );

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as GoogleGeocodingResponse;
    const firstLocation = body.results?.[0]?.geometry?.location;

    if (
      typeof firstLocation?.lat !== 'number' ||
      typeof firstLocation.lng !== 'number'
    ) {
      return null;
    }

    return {
      lat: firstLocation.lat,
      lng: firstLocation.lng,
    };
  }
}
