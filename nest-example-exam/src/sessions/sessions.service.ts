import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlayersService } from '@/players/players.service';

import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';

const MAX_ROUNDS: number = 10;

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
        private readonly playerService: PlayersService,
    ) {}

    async create(createSessionDto: CreateSessionDto): Promise<Session | null> {
        const player1 = await this.playerService.findOne(createSessionDto.playerId1);
        const player2 = await this.playerService.findOne(createSessionDto.playerId1);

        if (!(player1 && player2)) {
            throw new NotFoundException('Both players must exist.');
        }

        const newSession = this.sessionRepository.create({
            status: 'running',
            maxRounds: MAX_ROUNDS,
            player1: player1,
            player2: player2,
        });

        return await this.sessionRepository.save(newSession);
    }

    async findAll(): Promise<Session[]> {
        return await this.sessionRepository.find();
    }

    async findOne(sessionId: number): Promise<Session | null> {
        return await this.sessionRepository.findOneBy({ id: sessionId });
    }
}
