
import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { Redis } from 'ioredis';
import { RedisCacheService } from './redis-cache.service';
import { AppController } from './questionredis.controller';
import { AppService } from './app.service';
import { Question } from 'src/question/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
 
@Module({
  imports: [
        
        TypeOrmModule.forFeature([Question]),
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
    
    
    // 初始化redis，redis参数建议配置到外部配置文件引入
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis://localhost:6379',
        }
      }
    ]),
  ],

  controllers: [ AppController],
  providers: [RedisCacheService, Redis,AppService],
  exports: [RedisCacheService,AppService]
})
 
export class RedisCacheModule {}
