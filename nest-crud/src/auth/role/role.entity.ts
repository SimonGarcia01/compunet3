import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { RolePermission } from '../role-permission/rolePermission.entity';

export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;

    //Make the relation with the users
    @OneToMany(() => User, (user) => user.role)
    users: User[];

    //Make the relation to the intermediate table role_permissions
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];
}
