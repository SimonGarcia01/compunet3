import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

describe('CoursesService', () => {
    let service: CoursesService;
    let courseRepository: Repository<Course>;

    const mockCourseRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoursesService,
                {
                    provide: getRepositoryToken(Course),
                    useValue: mockCourseRepository,
                },
            ],
        }).compile();

        service = module.get<CoursesService>(CoursesService);
        courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a course', async () => {
            const dto = {
                name: 'Compilers',
                credits: 4,
                duration: 16,
                startDate: new Date('2026-01-15T00:00:00.000Z'),
            };
            const created = { id: 1, ...dto } as Course;

            mockCourseRepository.create.mockReturnValue(created);
            mockCourseRepository.save.mockResolvedValue(created);

            const result = await service.create(dto);

            expect(courseRepository.create).toHaveBeenCalledWith(dto);
            expect(courseRepository.save).toHaveBeenCalledWith(created);
            expect(result).toEqual(created);
        });
    });

    describe('findAll', () => {
        it('should return all courses', async () => {
            const courses = [{ id: 1 }, { id: 2 }] as Course[];
            mockCourseRepository.find.mockResolvedValue(courses);

            const result = await service.findAll();

            expect(courseRepository.find).toHaveBeenCalled();
            expect(result).toEqual(courses);
        });
    });

    describe('findOne', () => {
        it('should return a course by id with relations', async () => {
            const course = { id: 1 } as Course;
            mockCourseRepository.findOne.mockResolvedValue(course);

            const result = await service.findOne(1);

            expect(courseRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['usersCourses'],
            });
            expect(result).toEqual(course);
        });

        it('should throw NotFoundException if course does not exist', async () => {
            mockCourseRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an existing course', async () => {
            const existing = {
                id: 1,
                name: 'Compilers',
                credits: 4,
                duration: 16,
                startDate: new Date('2026-01-15T00:00:00.000Z'),
            } as Course;

            const updated = {
                ...existing,
                name: 'Advanced Compilers',
            } as Course;

            mockCourseRepository.findOne.mockResolvedValue(existing);
            mockCourseRepository.save.mockResolvedValue(updated);

            const result = await service.update(1, { name: 'Advanced Compilers' });

            expect(courseRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    name: 'Advanced Compilers',
                }),
            );
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException when updating a missing course', async () => {
            mockCourseRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, { name: 'Ghost course' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove an existing course and return confirmation message', async () => {
            const existing = { id: 1 } as Course;
            mockCourseRepository.findOne.mockResolvedValue(existing);
            mockCourseRepository.remove.mockResolvedValue(existing);

            const result = await service.remove(1);

            expect(courseRepository.remove).toHaveBeenCalledWith(existing);
            expect(result).toEqual({ message: 'Course with id 1 has been removed' });
        });

        it('should throw NotFoundException when removing a missing course', async () => {
            mockCourseRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
