import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { Course } from 'src/course/courses/entities/course.entity';
import { UserCourseService } from './user-course.service';
import { UserCourse } from './entities/user-course.entity';
import { UserCourseRelationTypes } from './dto/create-user-course.dto';

describe('UserCourseService', () => {
    let service: UserCourseService;
    let userCourseRepository: Repository<UserCourse>;
    let userRepository: Repository<User>;
    let courseRepository: Repository<Course>;

    const mockUserCourseRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockCourseRepository = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserCourseService,
                {
                    provide: getRepositoryToken(UserCourse),
                    useValue: mockUserCourseRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(Course),
                    useValue: mockCourseRepository,
                },
            ],
        }).compile();

        service = module.get<UserCourseService>(UserCourseService);
        userCourseRepository = module.get<Repository<UserCourse>>(getRepositoryToken(UserCourse));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user-course relation', async () => {
            const dto = {
                userId: 1,
                courseId: 2,
                relationType: UserCourseRelationTypes.STUDENT,
            };
            const user = { id: 1 } as User;
            const course = { id: 2 } as Course;
            const created = {
                id: 10,
                user,
                course,
                relationType: UserCourseRelationTypes.STUDENT,
            } as UserCourse;

            mockUserRepository.findOne.mockResolvedValue(user);
            mockCourseRepository.findOne.mockResolvedValue(course);
            mockUserCourseRepository.findOne.mockResolvedValue(null);
            mockUserCourseRepository.create.mockReturnValue(created);
            mockUserCourseRepository.save.mockResolvedValue(created);

            const result = await service.create(dto);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.userId } });
            expect(courseRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.courseId } });
            expect(userCourseRepository.findOne).toHaveBeenCalledWith({
                where: { user: { id: 1 }, course: { id: 2 } },
            });
            expect(userCourseRepository.save).toHaveBeenCalledWith(created);
            expect(result).toEqual(created);
        });

        it('should throw NotFoundException when user is missing', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create({
                    userId: 1,
                    courseId: 2,
                    relationType: UserCourseRelationTypes.STUDENT,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when course is missing', async () => {
            const user = { id: 1 } as User;
            mockUserRepository.findOne.mockResolvedValue(user);
            mockCourseRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create({
                    userId: 1,
                    courseId: 2,
                    relationType: UserCourseRelationTypes.STUDENT,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when relation already exists', async () => {
            const user = { id: 1 } as User;
            const course = { id: 2 } as Course;
            const existing = { id: 99 } as UserCourse;

            mockUserRepository.findOne.mockResolvedValue(user);
            mockCourseRepository.findOne.mockResolvedValue(course);
            mockUserCourseRepository.findOne.mockResolvedValue(existing);

            await expect(
                service.create({
                    userId: 1,
                    courseId: 2,
                    relationType: UserCourseRelationTypes.STUDENT,
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return all user-course relations', async () => {
            const data = [{ id: 1 }, { id: 2 }] as UserCourse[];
            mockUserCourseRepository.find.mockResolvedValue(data);

            const result = await service.findAll();

            expect(userCourseRepository.find).toHaveBeenCalledWith({ relations: ['user', 'course'] });
            expect(result).toEqual(data);
        });
    });

    describe('findOne', () => {
        it('should return one user-course relation', async () => {
            const item = { id: 1 } as UserCourse;
            mockUserCourseRepository.findOne.mockResolvedValue(item);

            const result = await service.findOne(1);

            expect(userCourseRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['user', 'course'],
            });
            expect(result).toEqual(item);
        });

        it('should throw NotFoundException when relation is missing', async () => {
            mockUserCourseRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update relation type when provided', async () => {
            const existing = {
                id: 1,
                relationType: UserCourseRelationTypes.STUDENT,
            } as UserCourse;
            const updated = {
                ...existing,
                relationType: UserCourseRelationTypes.TA,
            } as UserCourse;

            mockUserCourseRepository.findOne.mockResolvedValue(existing);
            mockUserCourseRepository.save.mockResolvedValue(updated);

            const result = await service.update(1, { relationType: UserCourseRelationTypes.TA });

            expect(userCourseRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    relationType: UserCourseRelationTypes.TA,
                }),
            );
            expect(result).toEqual(updated);
        });

        it('should keep relation type when not provided', async () => {
            const existing = {
                id: 1,
                relationType: UserCourseRelationTypes.PROFESSOR,
            } as UserCourse;

            mockUserCourseRepository.findOne.mockResolvedValue(existing);
            mockUserCourseRepository.save.mockResolvedValue(existing);

            const result = await service.update(1, {});

            expect(result.relationType).toBe(UserCourseRelationTypes.PROFESSOR);
        });
    });

    describe('remove', () => {
        it('should remove a relation and return message', async () => {
            const existing = { id: 1 } as UserCourse;
            mockUserCourseRepository.findOne.mockResolvedValue(existing);
            mockUserCourseRepository.remove.mockResolvedValue(existing);

            const result = await service.remove(1);

            expect(userCourseRepository.remove).toHaveBeenCalledWith(existing);
            expect(result).toEqual({ message: 'UserCourse with id 1 has been removed' });
        });

        it('should throw NotFoundException when removing missing relation', async () => {
            mockUserCourseRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
