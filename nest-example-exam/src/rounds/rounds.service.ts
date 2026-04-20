import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SessionsService } from '@/sessions/sessions.service';

import { CreateRoundDto } from './dto/create-round.dto';
import { Round } from './entities/round.entity';

@Injectable()
export class RoundsService {
    constructor(
        @InjectRepository(Round)
        private readonly roundRepository: Repository<Round>,
        private sessionService: SessionsService,
    ) {}

    async create(createRoundDto: CreateRoundDto): Promise<Round | null> {
        const session = await this.sessionService.findOne(createRoundDto.sessionId);

        if (!session) {
            throw new NotFoundException('The session couldnt be found');
        }

        // Ensure previous round for this session is finished (has 2 moves)
        const lastRound = await this.roundRepository.findOne({
            where: { session: { id: session.id } },
            order: { roundNumber: 'DESC' },
        });

        if (lastRound && lastRound.moves && lastRound.moves.length < 2) {
            throw new BadRequestException('Previous round must be finished before creating a new one');
        }

        const roundCount = (await this.roundRepository.countBy({ session: { id: session.id } })) + 1;
        const newRound = this.roundRepository.create({
            roundNumber: roundCount,
            session: session,
        });

        return this.roundRepository.save(newRound);
    }

    async findAll(): Promise<Round[]> {
        return this.roundRepository.find();
    }

    async findOne(roundId: number): Promise<Round | null> {
        return this.roundRepository.findOne({
            where: { id: roundId },
            relations: ['session', 'moves'],
        });
    }
}
