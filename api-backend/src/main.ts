import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de Validação Global (Essencial para DTOs e OpenAPI)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      transform: true, // Converte tipos (ex: string da URL para number)
      forbidNonWhitelisted: true,
    }),
  );

  // Configuração do Swagger conforme o Bloco 3
  const config = new DocumentBuilder()
    .setTitle('UAI QUARTOS - API Mestra')
    .setDescription(
      'Legislação de rede e protocolos de identificação para locação estudantil em Belo Horizonte.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Operações de Acesso e Identidade')
    .addTag('properties', 'Busca Geográfica e Inventário (PostGIS)')
    .addBearerAuth() // Prepara para segurança JWT futura
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 API rodando em: http://localhost:3000`);
  console.log(`📚 Swagger UI disponível em: http://localhost:3000/api/docs`);
}
bootstrap();