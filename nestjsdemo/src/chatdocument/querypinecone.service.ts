import { OpenAIEmbeddings } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import type {Pinecone, QueryResponse} from '@pinecone-database/pinecone';
@Injectable()
export class queryPineconeService {
  async queryEmbedding( 
     index,
    question: string,
    documentName: string,) {
      const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    
       let queryResponse = await index.query({
        topK: 10,
       vector: queryEmbedding,
        includeMetadata: true,
        includeValues: true,
        filter: {documentName: {$eq: documentName}},
      });
    
      return queryResponse;
    }
  }
