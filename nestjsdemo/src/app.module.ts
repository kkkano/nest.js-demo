import { Module } from '@nestjs/common';
import { RedisCacheModule} from './redis-cache/redis-cache.module';
import{QuestionModule}from './question/question.module';
import { FileModule } from './fileupload/file.modoule';
import * as dotenv from 'dotenv';
import { DocumentModule } from './chatdocument/chatdocument.module';
import { Repository } from 'typeorm';

@Module({
  imports: 
  [RedisCacheModule,QuestionModule,FileModule,DocumentModule,Repository],
  
})
export class AppModule {}