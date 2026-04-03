import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionGroup } from '../option-group/entities/option-group.entity';
import { Type } from '../type/entities/type.entity';

import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { Option } from './entities/option.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Option, OptionGroup, Type])],
    controllers: [OptionController],
    providers: [OptionService],
    exports: [TypeOrmModule],
})
export class OptionModule {}
