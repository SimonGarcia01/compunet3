import { User } from '@/auth/users/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleName {
    SUPER_ADMIN = 'super_admin',
    USER = 'user',
}

@ObjectType()
@Entity({ name: 'roles' })
export class Role {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => RoleName)
    @Column({ name: 'name', type: 'enum', enum: RoleName, unique: true })
    name!: string;

    @Field(() => String)
    @Column({ name: 'description', length: 255, nullable: true })
    description?: string;

    @Field(() => [User], { nullable: true })
    @OneToMany(() => User, (user) => user.role)
    users!: User[];
}
