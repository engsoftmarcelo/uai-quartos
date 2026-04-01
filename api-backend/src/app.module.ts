import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RepublicsModule } from './republics/republics.module';

@Module({
  imports: [
    AuthModule,      // Gerencia Login e KYC
    RepublicsModule, // Gerencia Repúblicas e Busca PostGIS
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}