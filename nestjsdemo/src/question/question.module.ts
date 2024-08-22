import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

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
    ],
    providers: [QuestionService],
    controllers: [QuestionController],
    exports: [QuestionService]
})
export class QuestionModule {}