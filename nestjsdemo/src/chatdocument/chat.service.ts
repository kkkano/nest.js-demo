import { Injectable } from '@nestjs/common';

import { PineconeService } from "./pinecone.service";
import { LLMResponse, QueryLLMService } from "./queryllm.service";
import { queryPineconeService } from "./querypinecone.service";
import { Pinecone } from "@pinecone-database/pinecone";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";
import { Question } from 'src/question/question.entity';
import { Repository } from 'typeorm';
import { QuestionDto } from 'src/question/question.Dto';
import { QuestionService } from 'src/question/question.service';

 // 确保导入正确的 Pinecone 模块

@Injectable()
export class QueryService {
    private client: Pinecone;
  constructor(
    private readonly queryPineconeService: queryPineconeService,
    private readonly llmService: QueryLLMService,
    private readonly redisService: RedisCacheService,
    private readonly questionService:QuestionService,
    private questionRepository: Repository<Question>,
  ) {
    this.client = new Pinecone();
  }


async saveLLmAnswerInMysql(question: string, ): Promise<Question> {
  const result = await this.handleQuery(question, undefined);
  const newQuestionDto: QuestionDto = {
      id: undefined,
      question: question,
      answer: result,
      updatedtime: new Date(),
      createdtime: new Date()
  };
  const newQuestion = await this.questionService.createQuestion(newQuestionDto);
 
  return newQuestion ;
}



  async getDataFromMySQL(key) {
    const question = await this.questionRepository.findOne({ where: { question: key } });
    return question;
  }

  async handleQuery(question: string, documentName: string): Promise<string> {
    // const client = new Pinecone();
    const index = this.client.Index(process.env.PINECONE_INDEX_NAME || '');
    const queryResponse = await this.queryPineconeService.queryEmbedding(index, question, documentName);
    const result = await this.llmService.queryLLM(queryResponse, question);
    return result.result;
  }
  async getredis(key: string) {
    //如果Redis有就返回，否则就去MySQL查
    const res = await this.redisService.get(key);
    if (res === null) {
      const dataFromMySQL = await this.getDataFromMySQL(key); 
      //如果MySQL有就返回，并用set存入Redis
      if (dataFromMySQL !== null) {
        await this.redisService.set(key, JSON.stringify(dataFromMySQL));
        return dataFromMySQL;
    }
    //MySQL和Redis都没有就用AI查Pinecone，并把llm生成的结果存入mysql
} else if (res === 'Value not found in Redis or MySQL') {
  
  return  await this.saveLLmAnswerInMysql(key);
  
} else {
  return res;
}
  }
}
