import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsInt, IsPositive } from 'class-validator';

export class CreateUserRoleDto {
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'User ID must be an integer' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId!: number;

    @ApiProperty({ example: 2 })
    @IsInt({ message: 'Role ID must be an integer' })
    @IsPositive({ message: 'Role ID must be a positive integer' })
    roleId!: number;
}
