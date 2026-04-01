import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importação dos Módulos Funcionais
import { AuthModule } from './auth/auth.module';
import { RepublicsModule } from './republics/republics.module';
import { SocialModule } from './social/social.module';
import { FinanceModule } from './finance/finance.module';

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