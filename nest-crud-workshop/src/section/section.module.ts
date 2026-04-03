import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Type } from '../type/entities/type.entity';
import { Survey } from '../survey/entities/survey.entity';

import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section } from './entities/section.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Section, Type, Survey])],
    controllers: [SectionController],
    providers: [SectionService],
    exports: [TypeOrmModule],
})
export class SectionModule {}
