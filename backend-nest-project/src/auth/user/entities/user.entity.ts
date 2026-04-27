import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from 'src/auth/user-role/entities/user-role.entity';
import { UserBadge } from 'src/badge/user-badge/entities/user-badge.entity';
import { AttendanceSuppSession } from 'src/supplementary-session/attendance-supp-session/entities/attendance-supp-session.entity';
import { Post } from 'src/interaction/post/entities/post.entity';
import { Reply } from 'src/interaction/reply/entities/reply.entity';
import { UserCourse } from 'src/course/user-course/entities/user-course.entity';

import { Majors } from '../dto/create-user.dto';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true, length: 50 })
    email!: string;

    @Column({ nullable: false, length: 200 })
    password!: string;

    @Column({ name: 'first_name', nullable: false, length: 20 })
    firstName!: string;

    @Column({ name: 'last_name', nullable: false, length: 20 })
    lastName!: string;

    @Column({ name: 'profile_pic', nullable: true, length: 100 })
    profilePic?: string;

    @Column({ name: 'major_1', type: 'enum', enum: Majors, nullable: false })
    major1!: Majors;

    @Column({ name: 'major_2', type: 'enum', enum: Majors, nullable: true })
    major2?: Majors | null;

    @Column({ nullable: false })
    xp!: number;

    @Column({ nullable: false })
    level!: number;

    @OneToMany(() => UserRole, (userRole) => userRole.user, { eager: true })
    usersRoles!: UserRole[];

    @OneToMany(() => UserBadge, (userBadge) => userBadge.user, { eager: true })
    usersBadges!: UserBadge[];

    @OneToMany(() => AttendanceSuppSession, (attendanceSession) => attendanceSession.ta)
    attendanceAsTa!: AttendanceSuppSession[];

    @OneToMany(() => AttendanceSuppSession, (attendanceSession) => attendanceSession.student)
    attendanceAsStudent!: AttendanceSuppSession[];

    @OneToMany(() => Post, (post) => post.user, { eager: true })
    posts!: Post[];

    @OneToMany(() => Reply, (reply) => reply.user, { eager: true })
    replies!: Reply[];

    @OneToMany(() => UserCourse, (userCourse) => userCourse.user, { eager: true })
    usersCourses!: UserCourse[];
}
