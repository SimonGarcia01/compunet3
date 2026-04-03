import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionGroupService } from './option-group.service';
import { OptionGroupController } from './option-group.controller';
import { OptionGroup } from './entities/option-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OptionGroup])],
    controllers: [OptionGroupController],
    providers: [OptionGroupService],
    exports: [TypeOrmModule],
})
export class OptionGroupModule {}
