import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateMetadatumDto {
    @IsString()
    @MaxLength(100)
    key!: string;

    @IsString()
    value!: string;

    @IsInt()
    questionId!: number;
}
