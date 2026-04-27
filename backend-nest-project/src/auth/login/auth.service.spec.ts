// src/auth/login/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from 'src/auth/user/user.service';
import { RoleNames } from 'src/auth/role/dto/create-role.dto';
import { PermissionNames } from 'src/auth/permission/dto/create-permission.dto';
import { Majors } from 'src/auth/user/dto/create-user.dto';

jest.mock('bcrypt', () => ({
    __esModule: true,
    compare: jest.fn(),
}));

const mockBcryptCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

const mockUserService = {
    findByEmailWithRoles: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
};

const mockUserWithRoles = {
    id: 4,
    email: 'dave@example.com',
    password: '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', // Password123
    firstName: 'Dave',
    lastName: 'Dawson',
    major1: Majors.PHYS,
    xp: 40,
    level: 4,
    usersRoles: [
        {
            id: 4,
            role: {
                id: 1,
                name: RoleNames.ADMIN,
                rolesPermissions: [
                    { id: 1, permission: { id: 1, name: PermissionNames.CREATE } },
                    { id: 2, permission: { id: 2, name: PermissionNames.READ } },
                ],
            },
        },
    ],
};

// Usuario sin roles asignados
const mockUserNoRoles = {
    ...mockUserWithRoles,
    id: 5,
    email: 'eve@example.com',
    usersRoles: [],
};

const loginDto = {
    email: 'dave@example.com',
    password: 'Password123',
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: mockUserService },
                { provide: JwtService,  useValue: mockJwtService  },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return an access_token when credentials are valid', async () => {
            mockUserService.findByEmailWithRoles.mockResolvedValue(mockUserWithRoles);
            mockBcryptCompare.mockResolvedValue(true as never);
            mockJwtService.sign.mockReturnValue('mocked.jwt.token');

            const result = await service.login(loginDto);

            expect(mockUserService.findByEmailWithRoles).toHaveBeenCalledWith(loginDto.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUserWithRoles.password);

            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: mockUserWithRoles.id,
                email: mockUserWithRoles.email,
                roles: [RoleNames.ADMIN],
                permissions: [PermissionNames.CREATE, PermissionNames.READ],
            });

            expect(result).toEqual({ access_token: 'mocked.jwt.token' });
        });

        it('should deduplicate permissions when user has multiple roles with shared permissions', async () => {
            const userWithTwoRoles = {
                ...mockUserWithRoles,
                usersRoles: [
                    {
                        id: 1,
                        role: {
                            id: 1,
                            name: RoleNames.ADMIN,
                            rolesPermissions: [
                                { id: 1, permission: { id: 1, name: PermissionNames.CREATE } },
                                { id: 2, permission: { id: 2, name: PermissionNames.READ } },
                            ],
                        },
                    },
                    {
                        id: 2,
                        role: {
                            id: 3,
                            name: RoleNames.TA,
                            rolesPermissions: [
                                { id: 3, permission: { id: 2, name: PermissionNames.READ } }, // duplicado
                                { id: 4, permission: { id: 3, name: PermissionNames.UPDATE } },
                            ],
                        },
                    },
                ],
            };

            mockUserService.findByEmailWithRoles.mockResolvedValue(userWithTwoRoles);
            mockBcryptCompare.mockResolvedValue(true as never);
            mockJwtService.sign.mockReturnValue('mocked.jwt.token');

            await service.login(loginDto);

            const signCall = mockJwtService.sign.mock.calls[0][0];

            expect(signCall.permissions).toEqual([
                PermissionNames.CREATE,
                PermissionNames.READ,
                PermissionNames.UPDATE,
            ]);
            expect(signCall.permissions.length).toBe(3);
            expect(signCall.roles).toEqual([RoleNames.ADMIN, RoleNames.TA]);
        });

        it('should return access_token for user with no roles (empty arrays)', async () => {
            mockUserService.findByEmailWithRoles.mockResolvedValue(mockUserNoRoles);
            mockBcryptCompare.mockResolvedValue(true as never);
            mockJwtService.sign.mockReturnValue('mocked.jwt.token');

            const result = await service.login({ email: 'eve@example.com', password: 'Password123' });

            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: mockUserNoRoles.id,
                email: mockUserNoRoles.email,
                roles: [],
                permissions: [],
            });
            expect(result).toEqual({ access_token: 'mocked.jwt.token' });
        });

        it('should throw NotFoundException when user does not exist', async () => {
            mockUserService.findByEmailWithRoles.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
            
            expect(mockJwtService.sign).not.toHaveBeenCalled();
        });

        it('should throw UnauthorizedException when password is incorrect', async () => {
            mockUserService.findByEmailWithRoles.mockResolvedValue(mockUserWithRoles);
            mockBcryptCompare.mockResolvedValue(false as never);

            await expect(
                service.login({ email: 'dave@example.com', password: 'WrongPassword' }),
            ).rejects.toThrow(UnauthorizedException);

            expect(mockJwtService.sign).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should return logout confirmation message', async () => {
            const result = await service.logout();

            expect(result).toEqual({
                message: 'Logged out successfully. Please discard your token on the client.',
            });
        });

        it('should not call any external service on logout', async () => {
            await service.logout();

            expect(mockUserService.findByEmailWithRoles).not.toHaveBeenCalled();
            expect(mockJwtService.sign).not.toHaveBeenCalled();
        });
    });
});