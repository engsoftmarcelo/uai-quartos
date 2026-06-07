import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { FinanceService } from './finance.service';

@Module({
  controllers: [ReservationsController],
  providers: [FinanceService],
})
export class FinanceModule {}
