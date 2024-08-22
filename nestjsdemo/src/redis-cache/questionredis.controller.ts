import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { QuestionDto } from '../question/question.Dto';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('/get')
  getQuestion1(@Query('question') key: string) {
    return this.appService.getCache({ key});
  }
}
  
//   @Get('/get')
//   getQuestion1() {
//     return this.appService.getCache({ key: '1' });
//   }
// }