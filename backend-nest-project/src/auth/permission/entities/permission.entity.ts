import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from 'src/auth/role-permission/entities/role-permission.entity';
import { PermissionNames } from 'src/auth/permission/dto/create-permission.dto';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: PermissionNames, nullable: false })
    name!: PermissionNames;

    @Column({ nullable: true, length: 50 })
    description?: string;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    rolesPermissions!: RolePermission[];
}
