import { JoinColumn, ManyToOne } from 'typeorm';

import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission';

// This represents the intermediate table between roles and permissions
export class RolePermission {
    //Now make the relation to both tables
    @ManyToOne(() => Role, (role) => role.rolePermissions)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}
