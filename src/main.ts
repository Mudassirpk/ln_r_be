import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:8081', 'http://172.25.18.33:8081'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
