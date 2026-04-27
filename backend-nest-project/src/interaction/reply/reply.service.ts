import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { Post } from 'src/interaction/post/entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { UserService } from 'src/auth/user/user.service';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(Reply)
        private readonly replyRepository: Repository<Reply>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
    ) {}

    async create(createReplyDto: CreateReplyDto): Promise<Reply> {
        const { postId, userId, replyId, ...replyData } = createReplyDto;

        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

        const user = await this.userService.findOne(userId);

        let parentReply: Reply | null = null;
        if (replyId) {
            parentReply = await this.replyRepository.findOne({ where: { id: replyId } });
            if (!parentReply) throw new NotFoundException(`Parent reply with ID ${replyId} not found`);
        }

        const reply = this.replyRepository.create({
            ...replyData,
            post,
            user,
            reply: parentReply,
            dateAdded: createReplyDto.dateAdded ?? new Date(),
            likes: 0,
            approvals: 0,
            isValidated: false,
        });

        const savedReply = await this.replyRepository.save(reply);
        await this.userService.addXp(userId, 5);
        return savedReply;
    }

    async findAll(): Promise<Reply[]> {
        return await this.replyRepository.find({
            relations: ['user', 'post', 'replies'],
        });
    }

    async findOne(id: number): Promise<Reply> {
        const reply = await this.replyRepository.findOne({
            where: { id },
            relations: ['user', 'post', 'replies', 'replies.user'],
        });
        if (!reply) throw new NotFoundException(`Reply with ID ${id} not found`);
        return reply;
    }

    async update(id: number, updateReplyDto: UpdateReplyDto): Promise<Reply> {
        const reply = await this.findOne(id);
        const { postId, userId, replyId, ...replyData } = updateReplyDto;

        if (postId) {
            const post = await this.postRepository.findOne({ where: { id: postId } });
            if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
            reply.post = post;
        }

        if (userId) {
            const user = await this.userService.findOne(userId);
            reply.user = user;
        }

        if (replyId !== undefined) {
            if (replyId === null) {
                reply.reply = null;
            } else {
                const parentReply = await this.replyRepository.findOne({ where: { id: replyId } });
                if (!parentReply) throw new NotFoundException(`Parent reply with ID ${replyId} not found`);
                reply.reply = parentReply;
            }
        }

        const updatedReply = this.replyRepository.merge(reply, replyData);
        return await this.replyRepository.save(updatedReply);
    }

    async remove(id: number): Promise<void> {
        const reply = await this.findOne(id);
        await this.replyRepository.remove(reply);
    }

    async like(id: number): Promise<Reply> {
        const reply = await this.findOne(id);
        reply.likes += 1;
        const savedReply = await this.replyRepository.save(reply);
        await this.userService.addXp(reply.user.id, 2);
        return savedReply;
    }

    async validate(id: number): Promise<Reply> {
        const reply = await this.findOne(id);
        reply.isValidated = true;
        reply.approvals += 1;
        const savedReply = await this.replyRepository.save(reply);
        await this.userService.addXp(reply.user.id, 50);
        return savedReply;
    }
}
