import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { PineconeService } from "./pinecone.service";
import { LLMResponse, QueryLLMService } from "./queryllm.service";
import { queryPineconeService } from "./querypinecone.service";
import { Pinecone } from "@pinecone-database/pinecone";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";
import { QueryService } from "./chat.service";

@Controller('api')
export class QueryController {

  constructor(
    private readonly queryPineconeService: queryPineconeService,
    private readonly queryService: QueryService ,
   
    private readonly llmService: QueryLLMService,
    
  ) {}

  @Post('chattest')
  async handleQuery(@Query() reqBody: { question: string, documentName: string }): Promise<String>{
    const { question, documentName } = reqBody;
    const client = new Pinecone();
    const index = client.Index(process.env.PINECONE_INDEX_NAME || '');
    const queryResponse = await this.queryPineconeService.queryEmbedding(index, question, documentName);
    const result = await this.llmService.queryLLM(queryResponse, question);
    return result.result;
  }

//   @Post('chat')
//   async chatQuery(@Query('question') question: string, ): Promise<string> {
//     return this.queryService.getredis(question);
//   }
// }
@Post('chat')
   async chatQuery(@Query() reqBody: { question: string, documentName: string }): Promise<string> {
    const { question, documentName } = reqBody;
    return this.queryService.getredis(question);
   }

   }




