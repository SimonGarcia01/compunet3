import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Task } from '@/tasks/entities/task.entity';

@Entity('task_assignments')
export class TaskAssignment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.taskAssignments)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Task, (task) => task.taskAssignments)
    @JoinColumn({ name: 'task_id' })
    task!: Task;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}
