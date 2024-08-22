import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "src/question/question.entity";
import { DocumentsController } from "./document.controller";
import { PineconeService } from "./pinecone.service";
import { QueryController } from "./chat.controller";
import { queryPineconeService } from "./querypinecone.service";
import { QueryLLMService } from "./queryllm.service";
import { QueryService } from "./chat.service";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";
import { RedisCacheModule } from "src/redis-cache/redis-cache.module";

import Redis from "ioredis";

import { AppService } from "src/redis-cache/app.service";
import { Repository } from "typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QuestionService } from "src/question/question.service";






@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities: [Question],
      synchronize: true, // 自动同步数据库结构，生产环境请谨慎使用
    }),
    TypeOrmModule.forFeature([Question]),
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost', // 修改为 host，并使用正确的主机和端口
          port: 6379
        }
      }
    ]),
    RedisCacheModule
  ],
  controllers: [DocumentsController, QueryController],
  providers: [
    QuestionService,
    Repository,
    PineconeService,
    queryPineconeService,
    QueryLLMService,
    QueryService,
    RedisCacheService,
    Redis,
    AppService
  ],
  exports: [
    QuestionService,
    Repository,
    PineconeService,
    queryPineconeService,
    QueryLLMService,
    QueryService,
    RedisCacheService,
    Redis,
    AppService
  ],
})
export class DocumentModule {}