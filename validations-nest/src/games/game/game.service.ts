import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '@/auth/user/user.service';

import { Game } from '../entities/game.entity';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        private readonly userService: UserService,
    ) {}

    create(_createGameDto: CreateGameDto) {
        return 'This action adds a new game';
    }

    async findAll() {
        return await this.gameRepository.find({
            relations: ['createdBy'],
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} game`;
    }

    update(id: number, _updateGameDto: UpdateGameDto) {
        return `This action updates a #${id} game`;
    }

    remove(id: number) {
        return `This action removes a #${id} game`;
    }
}
