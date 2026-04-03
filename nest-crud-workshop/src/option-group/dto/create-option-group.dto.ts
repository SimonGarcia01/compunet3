import { IsString, MaxLength } from 'class-validator';

export class CreateOptionGroupDto {
    @IsString()
    @MaxLength(100)
    name!: string;
}
