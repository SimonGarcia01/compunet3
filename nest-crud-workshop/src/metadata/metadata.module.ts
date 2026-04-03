import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from '../question/entities/question.entity';

import { Metadatum } from './entities/metadatum.entity';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Metadatum, Question])],
    controllers: [MetadataController],
    providers: [MetadataService],
    exports: [TypeOrmModule],
})
export class MetadataModule {}
