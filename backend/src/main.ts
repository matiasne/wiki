import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
