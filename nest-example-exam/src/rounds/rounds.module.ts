import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionsModule } from '@/sessions/sessions.module';

import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';
import { Round } from './entities/round.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Round]), SessionsModule],
    controllers: [RoundsController],
    providers: [RoundsService],
    exports: [RoundsService],
})
export class RoundsModule {}
