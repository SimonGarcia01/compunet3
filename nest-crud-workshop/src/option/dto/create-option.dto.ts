import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOptionDto {
    @IsString()
    @MaxLength(500)
    name!: string;

    @IsInt()
    typeId!: number;

    @IsOptional()
    @IsInt()
    groupId?: number;
}
