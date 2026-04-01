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
      whitelist: true,            // Remove silenciosamente qualquer propriedade não definida no DTO (ex: tentativas de injeção de campos como 'isAdmin: true').
      forbidNonWhitelisted: true, // Se o usuário enviar um pacote com propriedades não sintonizadas, rejeita com erro 400 (Bad Request).
      transform: true,            // Transforma automaticamente payloads JSON nos tipos corretos (converte strings matemáticas para numbers puros).
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