import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from '../question/entities/question.entity';
import { Interview } from '../interview/entities/interview.entity';

import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from './entities/answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Answer, Question, Interview])],
    controllers: [AnswerController],
    providers: [AnswerService],
    exports: [TypeOrmModule],
})
export class AnswerModule {}
