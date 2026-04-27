import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { SupplementarySession } from 'src/supplementary-session/supplementary-sessions/entities/supplementary-session.entity';

@Entity('attendance_supp_sessions')
@Unique(['ta', 'student', 'supplementarySession'])
export class AttendanceSuppSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.attendanceAsTa, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ta_id' })
    ta!: User;

    @ManyToOne(() => User, (user) => user.attendanceAsStudent, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student!: User;

    @ManyToOne(() => SupplementarySession, (supplementarySession) => supplementarySession.attendanceRecords, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'supp_session_id' })
    supplementarySession!: SupplementarySession;

    @Column({ name: 'attendance_notes', nullable: false, length: 1000 })
    attendanceNotes!: string;

    @Column({ name: 'additional_homework', nullable: true, length: 1000 })
    additionalHomework?: string;
}
