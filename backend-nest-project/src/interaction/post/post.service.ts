import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { UserService } from 'src/auth/user/user.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
    ) {}

    async create(createPostDto: CreatePostDto): Promise<Post> {
        const { userId, ...postData } = createPostDto;

        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const post = this.postRepository.create({
            ...postData,
            user,
            dateAdded: createPostDto.dateAdded ?? new Date(),
        });

        const savedPost = await this.postRepository.save(post);
        await this.userService.addXp(userId, 10);
        return savedPost;
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.find({
            relations: ['user', 'replies'],
        });
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'replies', 'replies.user'],
        });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.findOne(id);
        const { userId, ...postData } = updatePostDto;

        if (userId) {
            const user = await this.userService.findOne(userId);
            post.user = user;
        }

        const updatedPost = this.postRepository.merge(post, postData);
        return await this.postRepository.save(updatedPost);
    }

    async remove(id: number): Promise<void> {
        const post = await this.findOne(id);
        await this.postRepository.remove(post);
    }
}
