import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // On active CORS
  app.enableCors();

  // On lance la Gateway sur le port 4000
  await app.listen(4000);
  console.log('🚀 API Gateway lancée sur http://localhost:4000/graphql');
}
bootstrap();
