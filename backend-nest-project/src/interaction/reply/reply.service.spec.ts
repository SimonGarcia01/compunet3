import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';
import { Post } from 'src/interaction/post/entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { UserService } from 'src/auth/user/user.service';

describe('ReplyService', () => {
    let service: ReplyService;
    let replyRepository: Repository<Reply>;
    let postRepository: Repository<Post>;
    let userService: UserService;

    const mockReplyRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        merge: jest.fn(),
        remove: jest.fn(),
    };

    const mockPostRepository = {
        findOne: jest.fn(),
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
                ReplyService,
                {
                    provide: getRepositoryToken(Reply),
                    useValue: mockReplyRepository,
                },
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

        service = module.get<ReplyService>(ReplyService);
        replyRepository = module.get<Repository<Reply>>(getRepositoryToken(Reply));
        postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a reply successfully and award XP', async () => {
            const userId = 1;
            const postId = 1;
            const createReplyDto = { userId, postId, replyMessage: 'Test Reply' };
            const user = { id: userId } as User;
            const post = { id: postId } as Post;
            const reply = { id: 1, ...createReplyDto, user, post, dateAdded: new Date() };

            mockPostRepository.findOne.mockResolvedValue(post);
            mockUserService.findOne.mockResolvedValue(user);
            mockReplyRepository.create.mockReturnValue(reply);
            mockReplyRepository.save.mockResolvedValue(reply);
            mockUserService.addXp.mockResolvedValue(user);

            const result = await service.create(createReplyDto);
            expect(result).toEqual(reply);
            expect(mockUserService.addXp).toHaveBeenCalledWith(userId, 5);
        });

        it('should create a nested reply when replyId is provided', async () => {
            const dto = { userId: 1, postId: 1, replyId: 10, replyMessage: 'Nested reply' };
            const user = { id: 1 } as User;
            const post = { id: 1 } as Post;
            const parentReply = { id: 10 } as Reply;
            // Ignorar error de conversión de tipo por falta de propiedades necesarias para la creación, ya que no son relevantes para esta prueba
            const created = { id: 2, ...dto, user, post, reply: parentReply } as Reply;

            mockPostRepository.findOne.mockResolvedValue(post);
            mockUserService.findOne.mockResolvedValue(user);
            mockReplyRepository.findOne.mockResolvedValue(parentReply);
            mockReplyRepository.create.mockReturnValue(created);
            mockReplyRepository.save.mockResolvedValue(created);

            const result = await service.create(dto);

            expect(replyRepository.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
            expect(result).toEqual(created);
        });

        it('should throw NotFoundException when post does not exist', async () => {
            mockPostRepository.findOne.mockResolvedValue(null);

            await expect(service.create({ userId: 1, postId: 999, replyMessage: 'Invalid' })).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException when parent reply does not exist', async () => {
            const user = { id: 1 } as User;
            const post = { id: 1 } as Post;

            mockPostRepository.findOne.mockResolvedValue(post);
            mockUserService.findOne.mockResolvedValue(user);
            mockReplyRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create({ userId: 1, postId: 1, replyId: 404, replyMessage: 'Invalid parent' }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return all replies with relations', async () => {
            const replies = [{ id: 1 }, { id: 2 }] as Reply[];
            mockReplyRepository.find.mockResolvedValue(replies);

            const result = await service.findAll();

            expect(replyRepository.find).toHaveBeenCalledWith({
                relations: ['user', 'post', 'replies'],
            });
            expect(result).toEqual(replies);
        });
    });

    describe('findOne', () => {
        it('should return one reply with relations', async () => {
            const reply = { id: 1 } as Reply;
            mockReplyRepository.findOne.mockResolvedValue(reply);

            const result = await service.findOne(1);

            expect(replyRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['user', 'post', 'replies', 'replies.user'],
            });
            expect(result).toEqual(reply);
        });

        it('should throw NotFoundException when reply does not exist', async () => {
            mockReplyRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update post, user and parent reply', async () => {
            const existing = {
                id: 1,
                post: { id: 1 },
                user: { id: 1 },
                reply: null,
                replyMessage: 'Old',
            } as unknown as Reply;
            const post = { id: 2 } as Post;
            const user = { id: 2 } as User;
            const parentReply = { id: 3 } as Reply;
            const merged = {
                ...existing,
                post,
                user,
                reply: parentReply,
                replyMessage: 'New message',
            } as Reply;

            mockReplyRepository.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(parentReply);
            mockPostRepository.findOne.mockResolvedValue(post);
            mockUserService.findOne.mockResolvedValue(user);
            mockReplyRepository.merge.mockReturnValue(merged);
            mockReplyRepository.save.mockResolvedValue(merged);

            const result = await service.update(1, {
                postId: 2,
                userId: 2,
                replyId: 3,
                replyMessage: 'New message',
            });

            expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(userService.findOne).toHaveBeenCalledWith(2);
            expect(replyRepository.save).toHaveBeenCalledWith(merged);
            expect(result).toEqual(merged);
        });

        it('should clear parent reply when replyId is null', async () => {
            const existing = {
                id: 1,
                reply: { id: 8 },
                post: { id: 1 },
                user: { id: 1 },
            } as unknown as Reply;
            const merged = { ...existing, reply: null } as Reply;

            mockReplyRepository.findOne.mockResolvedValue(existing);
            mockReplyRepository.merge.mockReturnValue(merged);
            mockReplyRepository.save.mockResolvedValue(merged);
            // Ignorar error de TypeScript por asignación de null a una propiedad que no acepta null, ya que es necesario para la prueba
            const result = await service.update(1, { replyId: null });

            expect(result.reply).toBeNull();
        });

        it('should throw NotFoundException when updating with missing post', async () => {
            const existing = { id: 1, user: { id: 1 }, post: { id: 1 } } as unknown as Reply;

            mockReplyRepository.findOne.mockResolvedValue(existing);
            mockPostRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, { postId: 404 })).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when updating with missing parent reply', async () => {
            const existing = { id: 1, user: { id: 1 }, post: { id: 1 } } as unknown as Reply;

            mockReplyRepository.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);

            await expect(service.update(1, { replyId: 404 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a reply', async () => {
            const reply = { id: 1 } as Reply;
            mockReplyRepository.findOne.mockResolvedValue(reply);
            mockReplyRepository.remove.mockResolvedValue(reply);

            await service.remove(1);

            expect(replyRepository.remove).toHaveBeenCalledWith(reply);
        });

        it('should throw NotFoundException when removing a missing reply', async () => {
            mockReplyRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('like', () => {
        it('should increment likes and award XP to the author', async () => {
            const reply = { id: 1, likes: 0, user: { id: 1 } };
            mockReplyRepository.findOne.mockResolvedValue(reply);
            mockReplyRepository.save.mockResolvedValue({ ...reply, likes: 1 });

            const result = await service.like(1);
            expect(result.likes).toBe(1);
            expect(mockUserService.addXp).toHaveBeenCalledWith(1, 2);
        });

        it('should throw NotFoundException when liking a missing reply', async () => {
            mockReplyRepository.findOne.mockResolvedValue(null);

            await expect(service.like(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('validate', () => {
        it('should mark as validated and award XP to the author', async () => {
            const reply = { id: 1, isValidated: false, approvals: 0, user: { id: 1 } };
            mockReplyRepository.findOne.mockResolvedValue(reply);
            mockReplyRepository.save.mockResolvedValue({ ...reply, isValidated: true, approvals: 1 });

            const result = await service.validate(1);
            expect(result.isValidated).toBe(true);
            expect(mockUserService.addXp).toHaveBeenCalledWith(1, 50);
        });

        it('should throw NotFoundException when validating a missing reply', async () => {
            mockReplyRepository.findOne.mockResolvedValue(null);

            await expect(service.validate(999)).rejects.toThrow(NotFoundException);
        });
    });
});
