import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { SupplementarySessionsService } from './supplementary-sessions.service';
import { SupplementarySession } from './entities/supplementary-session.entity';

describe('SupplementarySessionsService', () => {
    let service: SupplementarySessionsService;
    let supplementarySessionRepository: Repository<SupplementarySession>;

    const mockSupplementarySessionRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplementarySessionsService,
                {
                    provide: getRepositoryToken(SupplementarySession),
                    useValue: mockSupplementarySessionRepository,
                },
            ],
        }).compile();

        service = module.get<SupplementarySessionsService>(SupplementarySessionsService);
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
        it('should create a supplementary session', async () => {
            const dto = {
                requestedDate: new Date('2026-04-01T10:00:00.000Z'),
                completed: false,
                topic: 'Pointers',
                virtual: true,
            };
            const created = { id: 1, ...dto } as SupplementarySession;

            mockSupplementarySessionRepository.create.mockReturnValue(created);
            mockSupplementarySessionRepository.save.mockResolvedValue(created);

            const result = await service.create(dto);

            expect(supplementarySessionRepository.create).toHaveBeenCalledWith(dto);
            expect(supplementarySessionRepository.save).toHaveBeenCalledWith(created);
            expect(result).toEqual(created);
        });
    });

    describe('findAll', () => {
        it('should return all supplementary sessions with attendance records', async () => {
            const sessions = [{ id: 1 }, { id: 2 }] as SupplementarySession[];
            mockSupplementarySessionRepository.find.mockResolvedValue(sessions);

            const result = await service.findAll();

            expect(supplementarySessionRepository.find).toHaveBeenCalledWith({
                relations: ['attendanceRecords'],
            });
            expect(result).toEqual(sessions);
        });
    });

    describe('findOne', () => {
        it('should return one supplementary session when found', async () => {
            const session = { id: 1 } as SupplementarySession;
            mockSupplementarySessionRepository.findOne.mockResolvedValue(session);

            const result = await service.findOne(1);

            expect(supplementarySessionRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['attendanceRecords'],
            });
            expect(result).toEqual(session);
        });

        it('should throw NotFoundException when supplementary session is not found', async () => {
            mockSupplementarySessionRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a supplementary session', async () => {
            const existing = {
                id: 1,
                requestedDate: new Date('2026-04-01T10:00:00.000Z'),
                completed: false,
                topic: 'Pointers',
                virtual: true,
                attendanceRecords: [],
            } as SupplementarySession;

            const updateDto = {
                completed: true,
                topic: 'Graphs',
            };

            const saved = {
                ...existing,
                ...updateDto,
            } as SupplementarySession;

            mockSupplementarySessionRepository.findOne.mockResolvedValue(existing);
            mockSupplementarySessionRepository.save.mockResolvedValue(saved);

            const result = await service.update(1, updateDto);

            expect(supplementarySessionRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    completed: true,
                    topic: 'Graphs',
                }),
            );
            expect(result).toEqual(saved);
        });

        it('should throw NotFoundException when trying to update a missing supplementary session', async () => {
            mockSupplementarySessionRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, { topic: 'Dynamic programming' })).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    // Aparece un error pero no afecta el funcionamiento de la prueba, se puede ignorar
    describe('remove', () => {
        it('should remove a supplementary session and return message', async () => {
            const existing = {
                id: 1,
                attendanceRecords: [],
            } as SupplementarySession;
            mockSupplementarySessionRepository.findOne.mockResolvedValue(existing);
            mockSupplementarySessionRepository.remove.mockResolvedValue(existing);

            const result = await service.remove(1);

            expect(supplementarySessionRepository.remove).toHaveBeenCalledWith(existing);
            expect(result).toEqual({ message: 'Supplementary session with id 1 has been removed' });
        });

        it('should throw NotFoundException when trying to remove a missing supplementary session', async () => {
            mockSupplementarySessionRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
