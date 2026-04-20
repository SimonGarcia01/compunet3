import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoundsService } from '@/rounds/rounds.service';
import { PlayersService } from '@/players/players.service';
import { Round } from '@/rounds/entities/round.entity';
import { Player } from '@/players/entities/player.entity';

import { CreateMoveDto } from './dto/create-move.dto';
import { Move, MoveType } from './entities/move.entity';

@Injectable()
export class MovesService {
    constructor(
        @InjectRepository(Move)
        private readonly moveRepository: Repository<Move>,
        @InjectRepository(Round)
        private readonly roundRepository: Repository<Round>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        private roundService: RoundsService,
        private playerService: PlayersService,
    ) {}

    async create(createMoveDto: CreateMoveDto): Promise<Move | null> {
        const player = await this.playerService.findOne(createMoveDto.playerId);

        if (!player) {
            throw new NotFoundException('The player was not found');
        }

        const round = await this.roundService.findOne(createMoveDto.roundId);

        if (!round) {
            throw new NotFoundException('The round was not found');
        }

        //Make sure that there is only one move per player in a round
        const existingMove = await this.moveRepository.findOne({
            where: {
                player: { id: createMoveDto.playerId },
                round: { id: createMoveDto.roundId },
            },
        });

        if (existingMove) {
            throw new BadRequestException('This player already made a move this round');
        }

        //Check if that the move they want to do is not the same as the last
        const roundBeforeNumber = round.roundNumber - 1;

        if (roundBeforeNumber !== 0) {
            const sessionId = round.session.id;
            const roundBefore = await this.roundRepository.findOne({
                where: {
                    roundNumber: roundBeforeNumber,
                    session: { id: sessionId },
                },
            });

            const moveDoneByPlayerBefore = await this.moveRepository.findOne({
                where: {
                    round: { id: roundBefore?.id },
                    player: { id: player.id },
                },
            });

            if (moveDoneByPlayerBefore?.moveType === createMoveDto.moveType) {
                throw new BadRequestException('A player cannot use a move type used the round before.');
            }
        }

        //Counting which move this would be for the round
        const moveCount = await this.moveRepository.count({
            where: { round: { id: round.id } },
        });

        const newMove = this.moveRepository.create({
            createdAt: new Date(),
            moveType: createMoveDto.moveType,
            player: player,
            round: round,
        });

        const savedMove = await this.moveRepository.save(newMove);

        // ensure savedMove has player relation available
        savedMove.player = player;

        // If the move got saved and the movecount was 1,then this must be the second move
        if (moveCount === 1) {
            //Look for the first move and load its player relation
            const firstMove = await this.moveRepository.findOne({
                where: { round: { id: round.id } },
                relations: ['player'],
                order: { createdAt: 'ASC' },
            });

            //Compare the moves and apply the game rules
            if (firstMove && savedMove) {
                await this.calculateRoundResult(firstMove, savedMove, round);
            }
        }

        //If the created move is the second one of the move, then the round must be updated
        // This will check the game rules

        return savedMove;
    }

    async findAll(): Promise<Move[]> {
        return this.moveRepository.find();
    }

    async findOne(id: number): Promise<Move | null> {
        return this.moveRepository.findOneBy({ id: id });
    }

    async calculateRoundResult(move1: Move, move2: Move, round: Round): Promise<void> {
        const move1Type = move1.moveType;
        const move2Type = move2.moveType;

        // defensive: ensure players are present
        if (!move1.player || !move2.player) return;

        if (move1Type === move2Type) {
            round.result = 'draw';
        } else if (move1Type === MoveType.ATTACK && move2Type === MoveType.DEFENSE) {
            round.result = 'Player 1 deals 10 damage to Player 2';
            await this.playerRepository.decrement({ id: move2.player.id }, 'health_points', 10);
        } else if (move1Type === MoveType.DEFENSE && move2Type === MoveType.ATTACK) {
            round.result = 'Player 2 deals 10 damage to Player 1';
            await this.playerRepository.decrement({ id: move1.player.id }, 'health_points', 10);
        } else if (move1Type === MoveType.DEFENSE && move2Type === MoveType.SPECIAL) {
            round.result = "Player 1 blocked Player 2's special move. No damage dealt.";
        } else if (move1Type === MoveType.SPECIAL && move2Type === MoveType.DEFENSE) {
            round.result = "Player 2 blocked Player 1's special move. No damage dealt.";
        } else if (move1Type === MoveType.SPECIAL && move2Type === MoveType.ATTACK) {
            round.result = 'Player 1 deals 20 damage to Player 2';
            await this.playerRepository.decrement({ id: move2.player.id }, 'health_points', 20);
        } else if (move1Type === MoveType.ATTACK && move2Type === MoveType.SPECIAL) {
            round.result = 'Player 2 deals 20 damage to Player 1';
            await this.playerRepository.decrement({ id: move1.player.id }, 'health_points', 20);
        }

        //Update only the result column to avoid touching relations
        await this.roundRepository.update({ id: round.id }, { result: round.result });
    }
}
