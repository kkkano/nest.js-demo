import { Injectable } from "@nestjs/common";
import { OpenAI } from 'langchain/llms/openai';
import { Document } from 'langchain/document';
import {loadQAStuffChain} from 'langchain/chains';
import type {Pinecone, QueryResponse} from '@pinecone-database/pinecone';
type Source = {
    pageContent: string;
    score: number;
  };
  export type LLMResponse = {
    result: string;
    sources: Source[];
  };
  
@Injectable()
export class QueryLLMService {
  async queryLLM(queryResponse: any, question: string): Promise<LLMResponse> {
    const llm = new OpenAI({
      modelName: 'gpt-3.5-turbo-0613',
      temperature: 0.3,
      // 其他配置参数
    });
    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches
      .map((match: any) => match.metadata.pageContent)
      .join('');
      
    const result = await chain.call({
      input_documents: [new Document({pageContent: concatenatedPageContent})],
      question: question,
    });

    return {
      result: result.text,
      sources: queryResponse.matches.map((x: any) => ({
        pageContent: x.metadata.pageContent,
        score: x.score,
      })),
    };
  }
}