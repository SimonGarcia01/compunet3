import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateReplyDto {
    @ApiProperty({ example: 10 })
    @IsInt({ message: 'Post ID must be an integer' })
    @IsPositive({ message: 'Post ID must be a positive integer' })
    postId!: number;

    @ApiProperty({ example: 1 })
    @IsInt({ message: 'User ID must be an integer' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId!: number;

    @ApiProperty({ example: 3, required: false })
    @IsInt({ message: 'Reply ID must be an integer' })
    @IsPositive({ message: 'Reply ID must be a positive integer' })
    @IsOptional()
    replyId?: number;

    @ApiProperty({ example: 'Great point! I suggest using ApiResponse for each status.' })
    @IsString({ message: 'Reply message must be a string' })
    @Length(1, 1000, { message: 'Reply message must be between 1 and 1000 characters' })
    replyMessage!: string;

    @ApiProperty({ example: '2026-04-26T00:00:00.000Z', required: false })
    @IsDateString({}, { message: 'Date added must be a valid ISO date string' })
    @Type(() => Date)
    @IsOptional()
    dateAdded?: Date;
}
