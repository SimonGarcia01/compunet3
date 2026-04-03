import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { Interview } from './entities/interview.entity';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Interview, Survey])],
    controllers: [InterviewController],
    providers: [InterviewService],
    exports: [TypeOrmModule],
})
export class InterviewModule {}
