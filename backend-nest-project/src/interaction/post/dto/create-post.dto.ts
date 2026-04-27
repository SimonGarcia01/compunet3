import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'User ID must be an integer' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId!: number;

    @ApiProperty({ example: 'Need help with decorators' })
    @IsString({ message: 'Title must be a string' })
    @Length(1, 30, { message: 'Title must be between 1 and 30 characters' })
    title!: string;

    @ApiProperty({ example: 'How can I document NestJS endpoints with Swagger?' })
    @IsString({ message: 'Question must be a string' })
    @Length(1, 1000, { message: 'Question must be between 1 and 1000 characters' })
    question!: string;

    @ApiProperty({ example: '2026-04-26T00:00:00.000Z', required: false })
    @IsDateString({}, { message: 'Date added must be a valid ISO date string' })
    @Type(() => Date)
    @IsOptional()
    dateAdded?: Date;
}
