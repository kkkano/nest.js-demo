
import { FileInterceptor } from '@nestjs/platform-express';

import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
@Controller('file')

export class FileController {
  constructor( private readonly questionService: FileService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  
  async uploadFile(@Param('id') id: number,@UploadedFile() file: Express.Multer.File) {
    const fileNameWithoutExtension = file.originalname.split('.')[0];
    const newQuestion = await this.questionService.createQuestion({ 
      id: id,
      question: fileNameWithoutExtension,
      answer: file.buffer.toString('utf-8'),
      updatedtime: new Date(),
      createdtime: new Date()
    });
    
    return newQuestion;
  }










  
}
// @Controller('file')
// export class FileController {
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file'))
//     uploadFile(@UploadedFile() file: Express.Multer.File) {
//       return{
//         filename:file.originalname,
//          content:file.buffer.toString('utf-8')
//       }
      
//     }
// }