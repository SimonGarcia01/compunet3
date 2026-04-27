import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupplementarySessionsService } from './supplementary-sessions.service';
import { SupplementarySessionsController } from './supplementary-sessions.controller';
import { SupplementarySession } from './entities/supplementary-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SupplementarySession])],
    controllers: [SupplementarySessionsController],
    providers: [SupplementarySessionsService],
})
export class SupplementarySessionsModule {}
