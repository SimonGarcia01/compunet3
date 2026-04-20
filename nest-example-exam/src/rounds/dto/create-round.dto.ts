import { IsInt, IsPositive } from 'class-validator';

export class CreateRoundDto {
    @IsInt()
    @IsPositive()
    sessionId!: number;
}
