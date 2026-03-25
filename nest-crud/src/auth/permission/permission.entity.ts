import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from '../role-permission/rolePermission.entity';

export class Permission {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;

    //Make the relations between roles and permissions, but using the intermediate table role_permissions
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    rolePermissions: RolePermission[];
}
