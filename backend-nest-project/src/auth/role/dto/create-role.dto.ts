import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export enum RoleNames {
    ADMIN = 'Admin',
    STUDENT = 'Student',
    TA = 'TA',
    PROFESSOR = 'Professor',
}

export class CreateRoleDto {
    @ApiProperty({ enum: RoleNames, example: RoleNames.ADMIN })
    @IsString({ message: 'Name must be a string' })
    @IsEnum(RoleNames, { message: `Name must be one of the following: ${Object.values(RoleNames).join(', ')}` })
    name!: RoleNames;

    @ApiProperty({ example: 'Administrator role with full permissions', description: 'Description of the role' })
    @IsString({ message: 'Description must be a string' })
    @Length(1, 50, { message: 'Description must be between 1 and 50 characters' })
    @IsOptional()
    description?: string;
}
