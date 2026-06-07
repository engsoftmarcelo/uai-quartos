import { Module } from '@nestjs/common';
import { RepublicsController } from './republics.controller';
import { RepublicsService } from './republics.service';
import { PrismaRepublicsAdapter } from './adapters/republics.prisma.adapter';
import { GeocodingService } from './geocoding.service';
import { REPUBLICS_REPOSITORY_PORT } from './interfaces/republics.repository.port';

@Module({
  controllers: [RepublicsController],
  providers: [
    RepublicsService,
    GeocodingService,
    {
      provide: REPUBLICS_REPOSITORY_PORT,
      useClass: PrismaRepublicsAdapter,
    },
  ],
})
export class RepublicsModule {}
