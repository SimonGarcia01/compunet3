import { IsInt, IsPositive } from 'class-validator';

export class CreateSessionDto {
    @IsInt()
    @IsPositive()
    playerId1!: number;

    @IsInt()
    @IsPositive()
    playerId2!: number;
}
