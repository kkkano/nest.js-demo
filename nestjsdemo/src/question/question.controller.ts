import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { QuestionDto } from './question.Dto';
import { QuestionService } from './question.service';

@Controller('api')
export class QuestionController {constructor(private readonly questionService: QuestionService) {}
 
@Get('aq/:question')
  getAnswerByQuestion(@Param('question') question: string) {
    return this.questionService.getAnswerByQuestion(question);
  }

@Get()
getAllQuestions() {
    return this.questionService.getAllQuestions();
}
@Get(':id')
getQuestionById(@Param('id') id: number) {
    return this.questionService.getQuestionById(id);
}

@Post()
createQuestion(@Body() questionDto: QuestionDto) {
    return this.questionService.createQuestion(questionDto);
}
@Delete(':id')
deleteQuestion(@Param('id') id: number) {
    return this.questionService.deleteQuestionById(id);
}
@Post('update/:id')
updateQuestion(@Param('id') id: number, @Body() questionDto: QuestionDto) {
    return this.questionService.updateQuestion(id, questionDto);
}
}