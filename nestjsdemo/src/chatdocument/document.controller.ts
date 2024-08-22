import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import { PineconeService } from './pinecone.service'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class DocumentsController {
  private readonly pineconeClient: Pinecone;
  private readonly pineconeService: PineconeService;

  constructor(pineconeService: PineconeService) {
    this.pineconeService = pineconeService;
    this.pineconeClient = new Pinecone();
  }


  // async createDocument(@Body() body: { name: string, text: string }) {
  //   const { name, text } = body;

  //   const doc = new Document({
  //     pageContent: text,
  //     metadata: { documentName: name },
  //   });
  @Post('document')
  @UseInterceptors(FileInterceptor('file')) // 处理文件上传
  async createDocument(@UploadedFile() file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const doc = new Document({
      pageContent: buffer.toString(), // 将文件内容转换为字符串
      metadata: { documentName: originalname },
    });

    const index = this.pineconeClient.Index(process.env.PINECONE_INDEX_NAME || '');

    try {
        await this.pineconeService.insertDocument(index, doc);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}