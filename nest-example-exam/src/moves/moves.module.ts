import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayersModule } from '@/players/players.module';
import { RoundsModule } from '@/rounds/rounds.module';
import { Round } from '@/rounds/entities/round.entity';
import { Player } from '@/players/entities/player.entity';

import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { Move } from './entities/move.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Move, Round, Player]), PlayersModule, RoundsModule],
    controllers: [MovesController],
    providers: [MovesService],
})
export class MovesModule {}
