import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { config } from 'dotenv';
config();
async function bootstrap() {
  dotenv.config();
  const question = await NestFactory.create(AppModule);
  await question.listen(3000);
}
bootstrap();
