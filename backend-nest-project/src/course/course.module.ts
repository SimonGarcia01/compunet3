import { Module } from '@nestjs/common';

import { CoursesModule } from './courses/courses.module';
import { UserCourseModule } from './user-course/user-course.module';

@Module({
    imports: [CoursesModule, UserCourseModule],
})
export class CourseModule {}
