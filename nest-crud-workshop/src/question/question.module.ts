import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Type } from '../type/entities/type.entity';
import { Section } from '../section/entities/section.entity';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entities/question.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Question, Type, Section])],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [TypeOrmModule],
})
export class QuestionModule {}
