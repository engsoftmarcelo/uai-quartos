import { Module } from '@nestjs/common';
import { RepublicsController } from './republics.controller';
import { RepublicsService } from './republics.service';
import { PrismaRepublicsAdapter } from './adapters/republics.prisma.adapter';
import { REPUBLICS_REPOSITORY_PORT } from './interfaces/republics.repository.port';

// 1. Importe o PrismaService do seu Core
import { PrismaService } from '../../core/prisma/prisma.service'; 

@Module({
  controllers: [RepublicsController],
  providers: [
    RepublicsService,
    PrismaService, // 2. ADICIONE ESTA LINHA: Libera o acesso ao banco para este módulo
    {
      provide: REPUBLICS_REPOSITORY_PORT,
      useClass: PrismaRepublicsAdapter,
    }
  ],
})
export class RepublicsModule {}