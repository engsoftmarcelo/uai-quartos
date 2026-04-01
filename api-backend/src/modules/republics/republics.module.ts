import { Module } from '@nestjs/common';
import { RepublicsController } from './republics.controller';
import { RepublicsService } from './republics.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [RepublicsController],
  providers: [RepublicsService, PrismaService], // Registrando o chef e o fornecedor
})
export class RepublicsModule {}