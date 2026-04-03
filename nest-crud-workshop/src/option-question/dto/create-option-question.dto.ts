import { IsInt, IsOptional } from 'class-validator';

export class CreateOptionQuestionDto {
    @IsInt()
    questionId!: number;

    @IsOptional()
    @IsInt()
    optionId?: number;

    @IsOptional()
    @IsInt()
    groupId?: number;
}
