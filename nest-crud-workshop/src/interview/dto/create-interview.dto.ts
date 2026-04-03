import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateInterviewDto {
    @IsDateString()
    timeStart!: string;

    @IsDateString()
    timeEnd!: string;

    @IsString()
    username!: string;

    @IsString()
    institutionId!: string;

    @IsString()
    interviewerId!: string;

    @IsInt()
    surveyId!: number;
}
