import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Question } from './question.entity';
import { QuestionDto } from './question.Dto';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        public questionRepository: Repository<Question>,
    ) {}

    async getAllQuestions(): Promise<Question[]> {
        return await this.questionRepository.find();
    }
    async getQuestionById(id: number): Promise<Question> {
        return await this.questionRepository.findOne({ where: { id } });
    }
    async createQuestion(questionDto: QuestionDto): Promise<Question> {
        const newQuestion = this.questionRepository.save(questionDto);
        return await newQuestion;
    }
    async deleteQuestionById(id: number): Promise<boolean> {
        const questionToRemove = await this.questionRepository.findOne({ where: { id } });
        
        if (!questionToRemove) {
            // 如果找不到对应id的问题，返回false表示删除失败
            return false;
        }
    
        await this.questionRepository.remove(questionToRemove);
        
        // 删除成功后返回true
        return true;
    }
    async updateQuestion(id: number, updatedQuestionData: Partial<QuestionDto>): Promise<Question | null> {
        const questionToUpdate = await this.questionRepository.findOne({ where: { id } });
        
        if (!questionToUpdate) {
            // 如果找不到对应id的问题，返回null表示更新失败
            return null;
        }
    
        // 更新问题数据
        Object.assign(questionToUpdate, updatedQuestionData);
    
        const updatedQuestion = await this.questionRepository.save(questionToUpdate);
    
        return updatedQuestion;
    }
    async getAnswerByQuestion(question: string): Promise<Question> {
        return this.questionRepository.findOne({ where: { question } });
    }
//     async getAnswerByQuestion(question: string): Promise<string[]> {
//         const questionEntity = await this.questionRepository.findOne({ where: { question } });

//         if (!questionEntity) {
//             return [];
//         }

//         // 假设数据库存储答案的字段为answers，以逗号分隔多个答案
//         const answers: string[] = questionEntity.answer.split(',');

//         return answers;
//     }
// }
    

// async getAnswerByQuestion(question: string): Promise<string[]> {
//     try {
//         const questionEntity = await this.questionRepository.findOne({ where: { question } });

//         if (!questionEntity || !questionEntity.answer) {
//             return [];
//         }

//         const answers: string[] = questionEntity.answer.split(',');
//         return answers;
//     } catch (error) {
//         console.log('Error in getAnswerByQuestion:', error);
//         return []; // 返回空数组或其他适当的错误处理
//     }
// }
// }
}