import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from 'src/auth/role-permission/entities/role-permission.entity';
import { UserRole } from 'src/auth/user-role/entities/user-role.entity';

import { RoleNames } from '../dto/create-role.dto';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: RoleNames, nullable: false })
    name!: RoleNames;

    @Column({ nullable: true, length: 50 })
    description?: string;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolesPermissions!: RolePermission[];

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    usersRoles!: UserRole[];
}
