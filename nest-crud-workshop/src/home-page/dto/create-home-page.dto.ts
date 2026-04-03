import { IsInt, IsString } from 'class-validator';

export class CreateHomePageDto {
    @IsString()
    backgroundImage!: string;

    @IsString()
    welcomeMessage!: string;

    @IsInt()
    surveyId!: number;
}
