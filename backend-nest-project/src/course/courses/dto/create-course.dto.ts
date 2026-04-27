import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsString, Length } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'Internet Computing III' })
    @IsString({ message: 'Course name must be a string' })
    @Length(1, 20, { message: 'Course name must be between 1 and 20 characters' })
    name!: string;

    @ApiProperty({ example: 3, enum: [1, 2, 3, 4, 5] })
    @IsInt({ message: 'Credits must be an integer' })
    @IsIn([1, 2, 3, 4, 5], { message: 'Credits must be between 1 and 5' })
    credits!: number;

    @ApiProperty({ example: 16, enum: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] })
    @IsInt({ message: 'Duration must be an integer' })
    @IsIn([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], {
        message: 'Duration must be between 4 and 18 weeks',
    })
    duration!: number;

    @ApiProperty({ example: '2026-08-10T00:00:00.000Z' })
    @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
    @Type(() => Date)
    startDate!: Date;
}
