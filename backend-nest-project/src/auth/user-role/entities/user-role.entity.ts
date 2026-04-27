import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { Role } from 'src/auth/role/entities/role.entity';

@Entity('users_roles')
@Unique(['user', 'role'])
export class UserRole {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.usersRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Role, (role) => role.usersRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role!: Role;
}
