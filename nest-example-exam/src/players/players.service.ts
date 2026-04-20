import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
    constructor(@InjectRepository(Player) private readonly playerRepository: Repository<Player>) {}

    async create(createPlayerDto: CreatePlayerDto): Promise<Player | null> {
        const newPlayer = {
            ...createPlayerDto,
            healthPoints: 100,
        };

        const dbPlayer = this.playerRepository.create(newPlayer);
        const savedPlayer = await this.playerRepository.save(dbPlayer);

        return savedPlayer;
    }

    async findAll(): Promise<Player[]> {
        return await this.playerRepository.find();
    }

    async findOne(playerId: number): Promise<Player | null> {
        return await this.playerRepository.findOneBy({ id: playerId });
    }
}
