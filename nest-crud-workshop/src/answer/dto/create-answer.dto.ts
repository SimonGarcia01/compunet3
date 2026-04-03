import { IsInt, IsString } from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    answer!: string;

    @IsInt()
    interviewId!: number;

    @IsInt()
    questionId!: number;
}
