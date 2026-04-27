import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

//Define the roles that can be assigned here:
export enum PermissionNames {
    CREATE = 'Create',
    READ = 'Read',
    UPDATE = 'Update',
    DELETE = 'Delete',
}

export class CreatePermissionDto {
    @ApiProperty({ example: PermissionNames.CREATE, enum: PermissionNames })
    @IsString({ message: 'Permission name must be a string' })
    @IsEnum(PermissionNames, {
        message: `Permission name must be one of the following: ${Object.values(PermissionNames).join(', ')}`,
    })
    name!: PermissionNames;

    @ApiProperty({ example: 'Permission to create resources', required: false })
    @IsString({ message: 'Description must be a string' })
    @Length(0, 50, { message: 'Description must be between 0 and 50 characters' })
    @IsOptional()
    description?: string;
}
