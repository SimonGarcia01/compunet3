import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateExperienceBadgeDto {
    @ApiProperty({ example: 'Bronze Scholar' })
    @IsString({ message: 'Badge name must be a string' })
    @Length(1, 20, { message: 'Badge name must be between 1 and 20 characters' })
    name!: string;

    @ApiProperty({ example: 5 })
    @IsInt({ message: 'Minimum level must be an integer' })
    @IsPositive({ message: 'Minimum level must be a positive integer' })
    minLevel!: number;

    @ApiProperty({ example: 'Congrats! You reached level 5.' })
    @IsString({ message: 'Message must be a string' })
    @Length(1, 100, { message: 'Message must be between 1 and 100 characters' })
    message!: string;

    @ApiProperty({ example: 'Premium plan discount 10%', required: false })
    @IsString({ message: 'Associate prices must be a string' })
    @Length(0, 100, { message: 'Associate prices must be between 0 and 100 characters' })
    @IsOptional()
    associatePrices?: string;
}
