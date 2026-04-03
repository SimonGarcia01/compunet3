import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Option } from '../option/entities/option.entity';
import { OptionGroup } from '../option-group/entities/option-group.entity';
import { Question } from '../question/entities/question.entity';

import { OptionQuestionService } from './option-question.service';
import { OptionQuestionController } from './option-question.controller';
import { OptionQuestion } from './entities/option-question.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OptionQuestion, Question, Option, OptionGroup])],
    controllers: [OptionQuestionController],
    providers: [OptionQuestionService],
    exports: [TypeOrmModule],
})
export class OptionQuestionModule {}
