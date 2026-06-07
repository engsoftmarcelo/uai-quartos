import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { KycModule } from './modules/kyc/kyc.module';
import { RepublicsModule } from './modules/republics/republics.module';
import { SocialModule } from './modules/social/social.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RepublicsModule,
    SocialModule,
    FinanceModule,
    KycModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
