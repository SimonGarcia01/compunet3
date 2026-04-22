import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from '@/tasks/entities/task.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => Task, (task) => task.project, { eager: false })
    tasks!: Task[];
}
