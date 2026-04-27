import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { SupplementarySession } from 'src/supplementary-session/supplementary-sessions/entities/supplementary-session.entity';
import { AttendanceSuppSession } from './entities/attendance-supp-session.entity';

import { CreateAttendanceSuppSessionDto } from './dto/create-attendance-supp-session.dto';
import { UpdateAttendanceSuppSessionDto } from './dto/update-attendance-supp-session.dto';

@Injectable()
export class AttendanceSuppSessionService {
    constructor(
        @InjectRepository(AttendanceSuppSession)
        private readonly attendanceSuppSessionRepository: Repository<AttendanceSuppSession>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(SupplementarySession)
        private readonly supplementarySessionRepository: Repository<SupplementarySession>,
    ) {}

    async create(createAttendanceSuppSessionDto: CreateAttendanceSuppSessionDto): Promise<AttendanceSuppSession> {
        const { taId, studentId, supplementarySessionId, attendanceNotes, additionalHomework } = createAttendanceSuppSessionDto;

        const ta = await this.userRepository.findOne({ where: { id: taId } });
        if (!ta) {
            throw new NotFoundException(`TA with id ${taId} not found`);
        }

        const student = await this.userRepository.findOne({ where: { id: studentId } });
        if (!student) {
            throw new NotFoundException(`Student with id ${studentId} not found`);
        }

        const supplementarySession = await this.supplementarySessionRepository.findOne({
            where: { id: supplementarySessionId },
        });
        if (!supplementarySession) {
            throw new NotFoundException(`Supplementary session with id ${supplementarySessionId} not found`);
        }

        const existingAttendance = await this.attendanceSuppSessionRepository.findOne({
            where: {
                ta: { id: ta.id },
                student: { id: student.id },
                supplementarySession: { id: supplementarySession.id },
            },
        });

        if (existingAttendance) {
            throw new ConflictException(
                `Attendance already exists for TA ${ta.id}, student ${student.id} and supplementary session ${supplementarySession.id}`,
            );
        }

        const attendance = this.attendanceSuppSessionRepository.create({
            ta,
            student,
            supplementarySession,
            attendanceNotes,
            additionalHomework,
        });

        return this.attendanceSuppSessionRepository.save(attendance);
    }

    async findAll(): Promise<AttendanceSuppSession[]> {
        return this.attendanceSuppSessionRepository.find({
            relations: ['ta', 'student', 'supplementarySession'],
        });
    }

    async findOne(id: number): Promise<AttendanceSuppSession> {
        const attendance = await this.attendanceSuppSessionRepository.findOne({
            where: { id },
            relations: ['ta', 'student', 'supplementarySession'],
        });

        if (!attendance) {
            throw new NotFoundException(`Attendance supplementary session with id ${id} not found`);
        }

        return attendance;
    }

    async update(
        id: number,
        updateAttendanceSuppSessionDto: UpdateAttendanceSuppSessionDto,
    ): Promise<AttendanceSuppSession> {
        const attendance = await this.findOne(id);

        if (updateAttendanceSuppSessionDto.taId !== undefined) {
            const ta = await this.userRepository.findOne({ where: { id: updateAttendanceSuppSessionDto.taId } });
            if (!ta) {
                throw new NotFoundException(`TA with id ${updateAttendanceSuppSessionDto.taId} not found`);
            }
            attendance.ta = ta;
        }

        if (updateAttendanceSuppSessionDto.studentId !== undefined) {
            const student = await this.userRepository.findOne({ where: { id: updateAttendanceSuppSessionDto.studentId } });
            if (!student) {
                throw new NotFoundException(`Student with id ${updateAttendanceSuppSessionDto.studentId} not found`);
            }
            attendance.student = student;
        }

        if (updateAttendanceSuppSessionDto.supplementarySessionId !== undefined) {
            const supplementarySession = await this.supplementarySessionRepository.findOne({
                where: { id: updateAttendanceSuppSessionDto.supplementarySessionId },
            });
            if (!supplementarySession) {
                throw new NotFoundException(
                    `Supplementary session with id ${updateAttendanceSuppSessionDto.supplementarySessionId} not found`,
                );
            }
            attendance.supplementarySession = supplementarySession;
        }

        if (updateAttendanceSuppSessionDto.attendanceNotes !== undefined) {
            attendance.attendanceNotes = updateAttendanceSuppSessionDto.attendanceNotes;
        }

        if (updateAttendanceSuppSessionDto.additionalHomework !== undefined) {
            attendance.additionalHomework = updateAttendanceSuppSessionDto.additionalHomework;
        }

        const duplicate = await this.attendanceSuppSessionRepository.findOne({
            where: {
                ta: { id: attendance.ta.id },
                student: { id: attendance.student.id },
                supplementarySession: { id: attendance.supplementarySession.id },
            },
        });

        if (duplicate && duplicate.id !== attendance.id) {
            throw new ConflictException(
                `Attendance already exists for TA ${attendance.ta.id}, student ${attendance.student.id} and supplementary session ${attendance.supplementarySession.id}`,
            );
        }

        return this.attendanceSuppSessionRepository.save(attendance);
    }

    async remove(id: number): Promise<{ message: string }> {
        const attendance = await this.findOne(id);
        await this.attendanceSuppSessionRepository.remove(attendance);
        return { message: `Attendance supplementary session with id ${id} has been removed` };
    }
}
