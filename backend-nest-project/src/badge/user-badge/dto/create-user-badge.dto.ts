import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateUserBadgeDto {
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'User ID must be an integer' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId!: number;

    @ApiProperty({ example: 2 })
    @IsInt({ message: 'Experience Badge ID must be an integer' })
    @IsPositive({ message: 'Experience Badge ID must be a positive integer' })
    experienceBadgeId!: number;

    @ApiProperty({ example: '2026-04-26T00:00:00.000Z', required: false })
    @IsDateString({}, { message: 'Date Acquired must be a valid date string' })
    @Type(() => Date)
    @IsOptional()
    dateAcquired?: Date;
}
