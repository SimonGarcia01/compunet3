import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

export enum UserCourseRelationTypes {
    STUDENT = 'student',
    PROFESSOR = 'professor',
    TA = 'ta',
}

export class CreateUserCourseDto {
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'userId must be an integer' })
    @IsPositive({ message: 'userId must be a positive integer' })
    userId!: number;

    @ApiProperty({ example: 2 })
    @IsInt({ message: 'courseId must be an integer' })
    @IsPositive({ message: 'courseId must be a positive integer' })
    courseId!: number;

    @ApiProperty({ example: UserCourseRelationTypes.STUDENT, enum: UserCourseRelationTypes })
    @IsEnum(UserCourseRelationTypes, {
        message: `relationType must be one of the following: ${Object.values(UserCourseRelationTypes).join(', ')}`,
    })
    relationType!: UserCourseRelationTypes;
}
