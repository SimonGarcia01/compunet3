import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TaskAssignment } from '@/task-assignments/entities/task-assignment.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user, { eager: true })
    taskAssignments!: TaskAssignment[];
}
