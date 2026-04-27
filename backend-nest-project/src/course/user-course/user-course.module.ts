import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserCourseService } from './user-course.service';
import { UserCourseController } from './user-course.controller';
import { UserCourse } from './entities/user-course.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserCourse, User, Course])],
    controllers: [UserCourseController],
    providers: [UserCourseService],
    exports: [UserCourseService],
})
export class UserCourseModule {}
