import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsString()
    tail!: string;

    @IsInt()
    orderCol!: number;

    @IsString()
    backgroundImage!: string;

    @IsOptional()
    @IsInt()
    sectionId?: number;

    @IsInt()
    typeId!: number;

    @IsOptional()
    @IsInt()
    surveyId?: number;
}
