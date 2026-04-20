import { IsEnum, IsInt, IsPositive } from 'class-validator';

import { MoveType } from '../entities/move.entity';

export class CreateMoveDto {
    @IsEnum(MoveType)
    moveType!: MoveType;

    @IsInt()
    @IsPositive()
    playerId!: number;

    @IsInt()
    @IsPositive()
    roundId!: number;
}
