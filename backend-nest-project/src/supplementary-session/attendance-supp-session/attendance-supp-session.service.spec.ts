import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { SupplementarySession } from 'src/supplementary-session/supplementary-sessions/entities/supplementary-session.entity';
import { AttendanceSuppSessionService } from './attendance-supp-session.service';
import { AttendanceSuppSession } from './entities/attendance-supp-session.entity';

describe('AttendanceSuppSessionService', () => {
    let service: AttendanceSuppSessionService;
    let attendanceRepository: Repository<AttendanceSuppSession>;
    let userRepository: Repository<User>;
    let supplementarySessionRepository: Repository<SupplementarySession>;

    const mockAttendanceRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockSupplementarySessionRepository = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AttendanceSuppSessionService,
                {
                    provide: getRepositoryToken(AttendanceSuppSession),
                    useValue: mockAttendanceRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(SupplementarySession),
                    useValue: mockSupplementarySessionRepository,
                },
            ],
        }).compile();

        service = module.get<AttendanceSuppSessionService>(AttendanceSuppSessionService);
        attendanceRepository = module.get<Repository<AttendanceSuppSession>>(getRepositoryToken(AttendanceSuppSession));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        supplementarySessionRepository = module.get<Repository<SupplementarySession>>(
            getRepositoryToken(SupplementarySession),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an attendance supplementary session', async () => {
            const ta = { id: 10 } as User;
            const student = { id: 20 } as User;
            const supplementarySession = { id: 30 } as SupplementarySession;

            const dto = {
                taId: 10,
                studentId: 20,
                supplementarySessionId: 30,
                attendanceNotes: 'Student attended and resolved recursion exercises',
                additionalHomework: 'Practice dynamic programming basics',
            };

            const created = {
                id: 1,
                ta,
                student,
                supplementarySession,
                attendanceNotes: dto.attendanceNotes,
                additionalHomework: dto.additionalHomework,
            } as AttendanceSuppSession;

            mockUserRepository.findOne.mockResolvedValueOnce(ta).mockResolvedValueOnce(student);
            mockSupplementarySessionRepository.findOne.mockResolvedValue(supplementarySession);
            mockAttendanceRepository.findOne.mockResolvedValueOnce(null);
            mockAttendanceRepository.create.mockReturnValue(created);
            mockAttendanceRepository.save.mockResolvedValue(created);

            const result = await service.create(dto);

            expect(userRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: dto.taId } });
            expect(userRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: dto.studentId } });
            expect(supplementarySessionRepository.findOne).toHaveBeenCalledWith({
                where: { id: dto.supplementarySessionId },
            });
            expect(attendanceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    ta: { id: ta.id },
                    student: { id: student.id },
                    supplementarySession: { id: supplementarySession.id },
                },
            });
            expect(attendanceRepository.save).toHaveBeenCalledWith(created);
            expect(result).toEqual(created);
        });

        it('should throw NotFoundException when TA does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create({
                    taId: 10,
                    studentId: 20,
                    supplementarySessionId: 30,
                    attendanceNotes: 'Notes',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when student does not exist', async () => {
            const ta = { id: 10 } as User;
            mockUserRepository.findOne.mockResolvedValueOnce(ta).mockResolvedValueOnce(null);

            await expect(
                service.create({
                    taId: 10,
                    studentId: 20,
                    supplementarySessionId: 30,
                    attendanceNotes: 'Notes',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when supplementary session does not exist', async () => {
            const ta = { id: 10 } as User;
            const student = { id: 20 } as User;
            mockUserRepository.findOne.mockResolvedValueOnce(ta).mockResolvedValueOnce(student);
            mockSupplementarySessionRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create({
                    taId: 10,
                    studentId: 20,
                    supplementarySessionId: 30,
                    attendanceNotes: 'Notes',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when attendance already exists', async () => {
            const ta = { id: 10 } as User;
            const student = { id: 20 } as User;
            const supplementarySession = { id: 30 } as SupplementarySession;
            const existing = { id: 99 } as AttendanceSuppSession;

            mockUserRepository.findOne.mockResolvedValueOnce(ta).mockResolvedValueOnce(student);
            mockSupplementarySessionRepository.findOne.mockResolvedValue(supplementarySession);
            mockAttendanceRepository.findOne.mockResolvedValue(existing);

            await expect(
                service.create({
                    taId: 10,
                    studentId: 20,
                    supplementarySessionId: 30,
                    attendanceNotes: 'Notes',
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return all attendance records', async () => {
            const records = [{ id: 1 }, { id: 2 }] as AttendanceSuppSession[];
            mockAttendanceRepository.find.mockResolvedValue(records);

            const result = await service.findAll();

            expect(attendanceRepository.find).toHaveBeenCalledWith({
                relations: ['ta', 'student', 'supplementarySession'],
            });
            expect(result).toEqual(records);
        });
    });

    describe('findOne', () => {
        it('should return one attendance record when found', async () => {
            const record = { id: 1 } as AttendanceSuppSession;
            mockAttendanceRepository.findOne.mockResolvedValue(record);

            const result = await service.findOne(1);

            expect(attendanceRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['ta', 'student', 'supplementarySession'],
            });
            expect(result).toEqual(record);
        });

        it('should throw NotFoundException when attendance record is not found', async () => {
            mockAttendanceRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an attendance record', async () => {
            const existing = {
                id: 1,
                ta: { id: 10 },
                student: { id: 20 },
                supplementarySession: { id: 30 },
                attendanceNotes: 'Old notes',
            } as AttendanceSuppSession;

            const updated = {
                ...existing,
                attendanceNotes: 'Updated notes',
                additionalHomework: 'Practice trees',
            } as AttendanceSuppSession;

            mockAttendanceRepository.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
            mockAttendanceRepository.save.mockResolvedValue(updated);

            const result = await service.update(1, {
                attendanceNotes: 'Updated notes',
                additionalHomework: 'Practice trees',
            });

            expect(attendanceRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    attendanceNotes: 'Updated notes',
                    additionalHomework: 'Practice trees',
                }),
            );
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException when TA update target does not exist', async () => {
            const existing = {
                id: 1,
                ta: { id: 10 },
                student: { id: 20 },
                supplementarySession: { id: 30 },
                attendanceNotes: 'Old notes',
            } as AttendanceSuppSession;

            mockAttendanceRepository.findOne.mockResolvedValue(existing);
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, { taId: 999 })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when update creates duplicate combination', async () => {
            const existing = {
                id: 1,
                ta: { id: 10 },
                student: { id: 20 },
                supplementarySession: { id: 30 },
                attendanceNotes: 'Old notes',
            } as AttendanceSuppSession;

            const duplicate = {
                id: 2,
                ta: { id: 10 },
                student: { id: 20 },
                supplementarySession: { id: 30 },
            } as AttendanceSuppSession;

            mockAttendanceRepository.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(duplicate);

            await expect(service.update(1, { attendanceNotes: 'Another value' })).rejects.toThrow(ConflictException);
        });
    });

    describe('remove', () => {
        it('should remove an attendance record and return message', async () => {
            const existing = {
                id: 1,
                ta: { id: 10 },
                student: { id: 20 },
                supplementarySession: { id: 30 },
            } as AttendanceSuppSession;

            mockAttendanceRepository.findOne.mockResolvedValue(existing);
            mockAttendanceRepository.remove.mockResolvedValue(existing);

            const result = await service.remove(1);

            expect(attendanceRepository.remove).toHaveBeenCalledWith(existing);
            expect(result).toEqual({
                message: 'Attendance supplementary session with id 1 has been removed',
            });
        });

        it('should throw NotFoundException when removing a missing attendance record', async () => {
            mockAttendanceRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
