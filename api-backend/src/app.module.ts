import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importação dos Módulos Funcionais
import { AuthModule } from './modules/auth/auth.module';
import { RepublicsModule } from './modules/republics/republics.module';
import { SocialModule } from './modules/social/social.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [
    // Registo dos sub-sistemas no ecossistema principal
    AuthModule,      // Gestão de Identidade e Login
    RepublicsModule, // Gestão Geográfica e PostGIS
    SocialModule,    // Heurística de Match e Convivência
    FinanceModule,   // Reservas, Faturas e Webhooks Iugu
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}