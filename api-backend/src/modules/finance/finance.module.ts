import { Module } from '@nestjs/common';
import { ClicksignService } from './clicksign.service';
import { FinanceController } from './finance.controller';
import { ReservationsController } from './reservations.controller';
import { FinanceService } from './finance.service';
import { IuguGatewayService } from './iugu-gateway.service';

@Module({
  controllers: [FinanceController, ReservationsController],
  providers: [ClicksignService, FinanceService, IuguGatewayService],
})
export class FinanceModule {}
