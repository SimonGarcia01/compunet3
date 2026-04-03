import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../project/entities/project.entity';

import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { Survey } from './entities/survey.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Survey, Project])],
    controllers: [SurveyController],
    providers: [SurveyService],
    exports: [TypeOrmModule],
})
export class SurveyModule {}
