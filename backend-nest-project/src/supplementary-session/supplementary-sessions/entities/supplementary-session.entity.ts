import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AttendanceSuppSession } from 'src/supplementary-session/attendance-supp-session/entities/attendance-supp-session.entity';

@Entity('supplementary_sessions')
export class SupplementarySession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'requested_date', type: 'timestamp', nullable: false })
    requestedDate!: Date;

    @Column({ nullable: true })
    completed?: boolean;

    @Column({ nullable: false, length: 100 })
    topic!: string;

    @Column({ nullable: false })
    virtual!: boolean;

    @OneToMany(() => AttendanceSuppSession, (attendance) => attendance.supplementarySession)
    attendanceRecords!: AttendanceSuppSession[];
}
