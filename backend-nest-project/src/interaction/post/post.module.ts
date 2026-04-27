import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';

import { UserModule } from 'src/auth/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User]), UserModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
