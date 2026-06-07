import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Liga ao banco quando o módulo inicia
  async onModuleInit() {
    await this.$connect();
  }

  // Desliga do banco quando a aplicação fecha
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
