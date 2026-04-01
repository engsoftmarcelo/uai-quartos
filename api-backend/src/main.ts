import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. MECANISMO UNIFICADO DE TRATAMENTO DE ERROS (Artefato de Sexta-feira)
  // Garante que todo erro (404, 500, etc.) tenha o mesmo formato JSON
  app.useGlobalFilters(new AllExceptionsFilter());

  // 2. VERIFICAÇÃO ROBÓTICA E AUTÔNOMA (ValidationPipe)
  // Limpa dados sujos e converte tipos (ex: string para number) automaticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Remove campos não definidos nos DTOs
      transform: true,         // Converte tipos baseados no DTO (Crucial para latitude/longitude)
      forbidNonWhitelisted: true, // Rejeita requisições com campos extras
    }),
  );

  // 3. TAXONOMIA FUNDAMENTAL OPENAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('UAI QUARTOS - API Mestra')
    .setDescription(
      'Legislação de rede, protocolos de identificação e gestão de feudos habitacionais em Belo Horizonte.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Operações de Acesso e Identidade')
    .addTag('properties', 'Busca Geográfica e Inventário (PostGIS)')
    .addTag('social', 'Heurística de Match e Convivência')
    .addTag('finance', 'Reservas, Faturas e Webhooks')
    .addBearerAuth() // Prepara para a segurança JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. INICIALIZAÇÃO DA FUNDAÇÃO VIRTUAL
  await app.listen(3000);
  
  console.log(`\n🚀 UAI QUARTOS está operacional em: http://localhost:3000`);
  console.log(`📚 Portal de Documentação: http://localhost:3000/api/docs\n`);
}
bootstrap();