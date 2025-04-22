import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

/**
 * Initializes and bootstraps the NestJS application.
 * - Creates an application instance using the `AppModule`.
 * - Applies global filters, interceptors, and pipes for exception handling,
 *   response transformation, and validation.
 * - Starts the application on port 3000.
 * @async
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
void bootstrap();
