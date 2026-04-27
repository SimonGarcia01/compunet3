import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { UserService } from 'src/auth/user/user.service';

describe('PostService', () => {
    let service: PostService;
    let postRepository: Repository<Post>;
    let userService: UserService;

    const mockPostRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        merge: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockUserService = {
        findOne: jest.fn(),
        addXp: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: mockPostRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        service = module.get<PostService>(PostService);
        postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a post successfully and award XP', async () => {
            const userId = 1;
            const createPostDto = { userId, title: 'Test Title', question: 'Test Question' };
            const user = { id: userId } as User;
            const post = { id: 1, ...createPostDto, user, dateAdded: new Date() };

            mockUserService.findOne.mockResolvedValue(user);
            mockPostRepository.create.mockReturnValue(post);
            mockPostRepository.save.mockResolvedValue(post);
            mockUserService.addXp.mockResolvedValue(user);

            const result = await service.create(createPostDto);
            expect(result).toEqual(post);
            expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
            expect(mockUserService.addXp).toHaveBeenCalledWith(userId, 10);
            expect(postRepository.create).toHaveBeenCalled();
            expect(postRepository.save).toHaveBeenCalledWith(post);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUserService.findOne.mockResolvedValue(null);
            await expect(service.create({ userId: 1, title: '', question: '' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            const posts = [{ id: 1, title: 'Post 1' }];
            mockPostRepository.find.mockResolvedValue(posts);

            const result = await service.findAll();
            expect(result).toEqual(posts);
            expect(postRepository.find).toHaveBeenCalledWith({ relations: ['user', 'replies'] });
        });
    });

    describe('findOne', () => {
        it('should return a single post', async () => {
            const post = { id: 1, title: 'Post 1' };
            mockPostRepository.findOne.mockResolvedValue(post);

            const result = await service.findOne(1);
            expect(result).toEqual(post);
            expect(postRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['user', 'replies', 'replies.user'],
            });
        });

        it('should throw NotFoundException if post not found', async () => {
            mockPostRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a post successfully', async () => {
            const post = { id: 1, title: 'Old Title', user: { id: 1 } };
            const updateDto = { title: 'New Title' };
            const updatedPost = { ...post, ...updateDto };

            mockPostRepository.findOne.mockResolvedValue(post);
            mockPostRepository.merge.mockReturnValue(updatedPost);
            mockPostRepository.save.mockResolvedValue(updatedPost);

            const result = await service.update(1, updateDto);
            expect(result).toEqual(updatedPost);
        });
    });

    describe('remove', () => {
        it('should remove a post successfully', async () => {
            const post = { id: 1 };
            mockPostRepository.findOne.mockResolvedValue(post);
            mockPostRepository.remove.mockResolvedValue(post);

            await service.remove(1);
            expect(postRepository.remove).toHaveBeenCalledWith(post);
        });
    });
});
