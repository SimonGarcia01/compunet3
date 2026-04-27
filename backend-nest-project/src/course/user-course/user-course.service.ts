import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { UpdateUserCourseDto } from './dto/update-user-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCourse } from './entities/user-course.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCourseService {
    constructor(
        @InjectRepository(UserCourse)
        private readonly userCourseRepository: Repository<UserCourse>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async create(createUserCourseDto: CreateUserCourseDto): Promise<UserCourse> {
        const user = await this.userRepository.findOne({
            where: { id: createUserCourseDto.userId },
        });
        if (!user) {
            throw new NotFoundException(`User with id ${createUserCourseDto.userId} not found`);
        }

        const course = await this.courseRepository.findOne({
            where: { id: createUserCourseDto.courseId },
        });
        if (!course) {
            throw new NotFoundException(`Course with id ${createUserCourseDto.courseId} not found`);
        }

        const existing = await this.userCourseRepository.findOne({
            where: { user: { id: user.id }, course: { id: course.id } },
        });
        if (existing) {
            throw new ConflictException(
                `User ${user.id} is already enrolled in course ${course.id}`,
            );
        }

        const userCourse = this.userCourseRepository.create({
            user,
            course,
            relationType: createUserCourseDto.relationType,
        });
        return this.userCourseRepository.save(userCourse);
    }

    async findAll(): Promise<UserCourse[]> {
        return this.userCourseRepository.find({ relations: ['user', 'course'] });
    }

    async findOne(id: number): Promise<UserCourse> {
        const userCourse = await this.userCourseRepository.findOne({
            where: { id },
            relations: ['user', 'course'],
        });
        if (!userCourse) {
            throw new NotFoundException(`UserCourse with id ${id} not found`);
        }
        return userCourse;
    }

    async update(id: number, updateUserCourseDto: UpdateUserCourseDto): Promise<UserCourse> {
        const userCourse = await this.findOne(id);
        if (updateUserCourseDto.relationType) {
            userCourse.relationType = updateUserCourseDto.relationType;
        }
        return this.userCourseRepository.save(userCourse);
    }

    async remove(id: number): Promise<{message: string}> {
        const userCourse = await this.findOne(id);
        await this.userCourseRepository.remove(userCourse);
        return { message: `UserCourse with id ${id} has been removed` };
    }
}
