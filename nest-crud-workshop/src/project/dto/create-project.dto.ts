import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsString()
    @MaxLength(1)
    state!: string;

    @IsInt()
    sectionId!: number;

    @IsString()
    username!: string;

    @IsString()
    password!: string;
}
