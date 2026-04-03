import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    @MaxLength(1000)
    name!: string;

    @IsString()
    @MaxLength(200)
    codQuest!: string;

    @IsInt()
    orderCol!: number;

    @IsOptional()
    @IsInt()
    questionId?: number;

    @IsInt()
    typeId!: number;

    @IsOptional()
    @IsInt()
    sectionId?: number;
}
