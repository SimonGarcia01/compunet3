import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '@/projects/entities/project.entity';
import { TaskAssignment } from '@/task-assignments/entities/task-assignment.entity';

export enum TaskStatus {
    TODO = 'To do',
    IN_PROGRESS = 'In progress',
    REVIEW = 'Review',
    DONE = 'done',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'enum', enum: TaskStatus })
    status!: TaskStatus;

    @ManyToOne(() => Project, (project) => project.tasks)
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @OneToMany(() => Task, (task) => task.parentTask, { eager: false })
    tasks!: Task[];

    @ManyToOne(() => Task, (task) => task.tasks, { nullable: true })
    @JoinColumn({ name: 'parent_task_id' })
    parentTask?: Task;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.task, { eager: false })
    taskAssignments!: TaskAssignment[];
}
