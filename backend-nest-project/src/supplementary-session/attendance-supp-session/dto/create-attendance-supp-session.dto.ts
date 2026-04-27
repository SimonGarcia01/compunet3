import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateAttendanceSuppSessionDto {
    @ApiProperty({ example: 5 })
    @IsInt({ message: 'TA ID must be an integer' })
    @IsPositive({ message: 'TA ID must be a positive integer' })
    taId!: number;

    @ApiProperty({ example: 18 })
    @IsInt({ message: 'Student ID must be an integer' })
    @IsPositive({ message: 'Student ID must be a positive integer' })
    studentId!: number;

    @ApiProperty({ example: 2 })
    @IsInt({ message: 'Supplementary Session ID must be an integer' })
    @IsPositive({ message: 'Supplementary Session ID must be a positive integer' })
    supplementarySessionId!: number;

    @ApiProperty({ example: 'El estudiante presento avance parcial y dudas puntuales.' })
    @IsString({ message: 'Attendance notes must be a string' })
    @Length(1, 1000, { message: 'Attendance notes must be between 1 and 1000 characters' })
    attendanceNotes!: string;

    @ApiProperty({ example: 'Resolver ejercicios 5 al 10 del taller 2.', required: false })
    @IsString({ message: 'Additional homework must be a string' })
    @Length(0, 1000, { message: 'Additional homework must be between 0 and 1000 characters' })
    @IsOptional()
    additionalHomework?: string;
}
