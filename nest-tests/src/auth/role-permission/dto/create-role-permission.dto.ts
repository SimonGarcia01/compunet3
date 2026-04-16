import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateRolePermissionDto {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    roleId!: number;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    permissionId!: number;
}
