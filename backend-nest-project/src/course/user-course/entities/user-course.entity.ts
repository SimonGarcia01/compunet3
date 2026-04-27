import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { Course } from 'src/course/courses/entities/course.entity';

import { UserCourseRelationTypes } from '../dto/create-user-course.dto';

@Entity('users_courses')
@Unique(['user', 'course'])
export class UserCourse {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.usersCourses, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Course, (course) => course.usersCourses, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @Column({ name: 'relation_type', type: 'enum', enum: UserCourseRelationTypes, nullable: false })
    relationType!: UserCourseRelationTypes;
}
