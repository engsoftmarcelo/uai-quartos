import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { RedisIoAdapter } from './core/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendOrigins = (
    process.env.FRONTEND_URLS ??
    'http://localhost:3001,http://localhost:3000,http://localhost:3003'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('UAI QUARTOS - API Mestra')
    .setDescription(
      'Monolito modular para identidade, moradia estudantil, matching e reservas.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Operacoes de acesso e identidade')
    .addTag('kyc', 'Onboarding documental e verificacao')
    .addTag('properties', 'Busca geografica e inventario')
    .addTag('social', 'Heuristica de match e convivencia')
    .addTag('finance', 'Reservas, faturas e webhooks')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const redisIoAdapter = new RedisIoAdapter(app);
  const redisEnabled = await redisIoAdapter.connectToRedis();

  if (redisEnabled) {
    app.useWebSocketAdapter(redisIoAdapter);
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`UAI QUARTOS API: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}

void bootstrap();
