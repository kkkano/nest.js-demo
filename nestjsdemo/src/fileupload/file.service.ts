import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Question } from '../question/question.entity';
import { QuestionDto } from '../question/question.Dto';
@Injectable()
export class FileService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
    ) {}


async createQuestion(questionDto: QuestionDto): Promise<Question> {
    const existingQuestion = await this.questionRepository.findOne({  where: { id: questionDto.id } });
    if (existingQuestion) {
        throw new ConflictException('id 已存在');
    }

    const newQuestion = this.questionRepository.create(questionDto);
    return this.questionRepository.save(newQuestion);
}
}