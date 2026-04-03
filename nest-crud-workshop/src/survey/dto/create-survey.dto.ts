import { IsInt, IsString } from 'class-validator';

export class CreateSurveyDto {
    @IsString()
    name!: string;

    @IsString()
    intro!: string;

    @IsString()
    outro!: string;

    @IsString()
    validation!: string;

    @IsString()
    imageUrl!: string;

    @IsString()
    styles!: string;

    @IsInt()
    projectId!: number;
}
