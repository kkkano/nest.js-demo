import { Injectable } from '@nestjs/common';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Injectable()
export class PineconeService {
  async insertDocument(index: any, doc: Document) {
    const text = doc.pageContent;
    const documentName = doc.metadata.documentName;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const chunks = await textSplitter.createDocuments([text]);

    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' ')),
    );

    const batchSize = 100;
    let batch: any = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = {
        id: `${documentName}_${i}`,
        values: embeddingsArrays[i],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          documentName,
        },
      };
      batch.push(vector);

      console.log(`vector ${i} of ${chunks.length} chunks`);

      if (batch.length === batchSize || i === chunks.length - 1) {
        await index.upsert(batch);

        batch = [];
      }
    }
  }
}