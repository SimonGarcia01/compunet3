import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../role/role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true, nullable: false })
    name: string;
    @Column({ unique: true, nullable: false })
    email: string;
    @Column({ name: 'encrypted_password' })
    encryptedPassword: string;

    //Add the relationship to the roles
    //This states that a user can have only one role and that it is mapped to the users property in the Role entity
    //By being eager, it will automatically load the role when we load the user, this is useful for authentication and authorization
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    //Represents the column that will be used to join the user with the role
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
