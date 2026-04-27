import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsInt, IsPositive } from 'class-validator';

export class CreateRolePermissionDto {
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'Role ID must be an integer' })
    @IsPositive({ message: 'Role ID must be a positive integer' })
    roleId!: number;

    @ApiProperty({ example: 2 })
    @IsInt({ message: 'Permission ID must be an integer' })
    @IsPositive({ message: 'Permission ID must be a positive integer' })
    permissionId!: number;
}
