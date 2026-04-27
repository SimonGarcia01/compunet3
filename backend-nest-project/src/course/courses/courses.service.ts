import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course) 
        private readonly courseRepository: Repository<Course>
    ) {}
    
    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        const course = this.courseRepository.create(createCourseDto);
        return this.courseRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return this.courseRepository.find();
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.courseRepository.findOne({ 
            where: { id },
            relations: ['usersCourses'],

        });
        if (!course) {
            throw new NotFoundException(`Course with id ${id} not found`);
        }
        return course;
    }

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);
        Object.assign(course, updateCourseDto);
        return this.courseRepository.save(course);
    }

    async remove(id: number): Promise<{message: string }> {
        const course = await this.findOne(id);
        await this.courseRepository.remove(course);
        return { message: `Course with id ${id} has been removed` };
    }
}
