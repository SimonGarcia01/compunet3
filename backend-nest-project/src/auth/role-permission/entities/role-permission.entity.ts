import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Role } from 'src/auth/role/entities/role.entity';
import { Permission } from 'src/auth/permission/entities/permission.entity';

@Entity('roles_permissions')
@Unique(['role', 'permission'])
export class RolePermission {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Role, (role) => role.rolesPermissions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role!: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolesPermissions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission!: Permission;
}
