import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserCourse } from 'src/course/user-course/entities/user-course.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, length: 20 })
    name!: string;

    @Column({ nullable: false })
    credits!: number;

    @Column({ nullable: false })
    duration!: number;

    @Column({ name: 'start_date', type: 'timestamp', nullable: false })
    startDate!: Date;

    @OneToMany(() => UserCourse, (userCourse) => userCourse.course)
    usersCourses!: UserCourse[];
}
