import { IsInt, IsString } from 'class-validator';

export class CreateAssignmentDto {
    @IsInt()
    amount!: number;

    @IsString()
    userId!: string;

    @IsInt()
    surveyId!: number;
}
