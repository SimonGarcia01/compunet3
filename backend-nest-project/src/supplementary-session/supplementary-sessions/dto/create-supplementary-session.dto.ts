import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsBooleanString, IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateSupplementarySessionDto {
    @ApiProperty({ example: '2026-05-10T14:00:00.000Z' })
    @IsDateString({}, { message: 'Requested date must be a valid ISO 8601 date string' })
    @Type(() => Date)
    requestedDate!: Date;

    @ApiProperty({ example: false, required: false })
    @IsBooleanString({ message: 'Completed must be a boolean value' })
    @Type(() => Boolean)
    @IsOptional()
    completed?: boolean;

    @ApiProperty({ example: 'Integrales y ecuaciones diferenciales' })
    @IsString({ message: 'Topic must be a string' })
    @Length(1, 100, { message: 'Topic must be between 1 and 100 characters' })
    topic!: string;

    @ApiProperty({ example: true })
    @IsBooleanString({ message: 'Virtual must be a boolean value' })
    @Type(() => Boolean)
    virtual!: boolean;
}
