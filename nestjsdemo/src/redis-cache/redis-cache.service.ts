import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Question } from 'src/question/question.entity';
import { Repository, createConnection, getConnection, getRepository } from 'typeorm';
  // 获取
  // async get(key) {
  //   const res = await this.redis.get(key);
  //   if (res===null) {
  //     return "Redis中不存在该问题的答案";
  //   }else
  //   return JSON.parse(res);
  // }
 
  @Injectable()
  export class RedisCacheService {
    constructor(
      private readonly redis: Redis,
      @InjectRepository(Question)
      private questionRepository: Repository<Question>,
    ) {}
  
    async set(key, value) {
      return await this.redis.set(key, JSON.stringify(value));
    }
  
    async get(key) {
      //先查找Redis 为null则查找Mysql
      const res = await this.redis.get(key);
      if (res === null) {
        const dataFromMySQL = await this.getDataFromMySQL(key);
        //如果mysql中存在则返回结果并存入redis
        if (dataFromMySQL!==null) {
          await this.redis.set(key, JSON.stringify(dataFromMySQL));
          return dataFromMySQL;
          //mysql和redis都没有查询到
        } else {
          return 'Value not found in Redis or MySQL';
        }
      } else {
        return JSON.parse(res);
      }
    }
    async getredis(key) {
      //先查找Redis 为null则查找Mysql
      const res = await this.redis.get(key);
      if (res === null) {
        const dataFromMySQL = await this.getDataFromMySQL(key);
        //如果mysql中存在则返回结果并存入redis
        if (dataFromMySQL!==null) {
          await this.redis.set(key, JSON.stringify(dataFromMySQL));
          return dataFromMySQL;
      } else {
        return JSON.parse(res);
      }
      }
    }
  
    async getDataFromMySQL(key) {
      const question = await this.questionRepository.findOne({ where: { question: key } });
      return question;
    }
  }
