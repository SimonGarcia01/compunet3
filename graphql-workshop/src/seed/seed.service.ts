import { Permission } from '@/auth/permissions/entities/permission.entity';
import { PermissionNames } from '@/auth/enums/permission-names.enum';
import { RolePermission } from '@/auth/roles-permissions/entities/role-permission.entity';
import { RoleName } from '@/auth/enums/role-names.enum';
import { Role } from '@/auth/roles/entities/role.entity';
import { User } from '@/auth/users/entities/user.entity';
import { Post } from '@/posts/entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    ) {}

    async runSeed(): Promise<string> {
        const superAdminRole = await this.getOrCreateRole(RoleName.SUPER_ADMIN, 'Super administrator with full access');
        const userRole = await this.getOrCreateRole(RoleName.USER, 'Regular user with limited access');

        const permissions = await this.getOrCreatePermissions();
        const superAdminPermission = permissions.find(
            (permission) => permission.name === PermissionNames.ADMIN_SUPER_POWER,
        );

        if (!superAdminPermission) {
            throw new Error('Failed to create admin_super_power permission');
        }

        await this.getOrCreateRolePermission(superAdminRole, superAdminPermission);

        const superAdminUser = await this.getOrCreateUser({
            fullName: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'superadmin123',
            role: superAdminRole,
        });

        const regularUser = await this.getOrCreateUser({
            fullName: 'Regular User',
            email: 'user@example.com',
            password: 'user12345',
            role: userRole,
        });

        await this.getOrCreatePost({
            title: 'Welcome from the Super Admin',
            content: 'This is the first seeded post created by the super admin account.',
            author: superAdminUser,
        });

        await this.getOrCreatePost({
            title: 'Regular User Introduction',
            content: 'This seeded post belongs to the regular user account.',
            author: regularUser,
        });

        await this.getOrCreatePost({
            title: 'System Announcement',
            content: 'This third seeded post shows the application content after seeding.',
            author: superAdminUser,
        });

        return 'Seed completed successfully';
    }

    private async getOrCreateRole(name: RoleName, description: string): Promise<Role> {
        const existingRole = await this.roleRepository.findOneBy({ name });

        if (existingRole) {
            return existingRole;
        }

        return await this.roleRepository.save(this.roleRepository.create({ name, description }));
    }

    private async getOrCreatePermissions(): Promise<Permission[]> {
        const permissionDefinitions = [
            {
                name: PermissionNames.ADMIN_SUPER_POWER,
                description: 'Full access to every resource and action',
            },
            {
                name: PermissionNames.READ_USERS,
                description: 'Read users',
            },
            {
                name: PermissionNames.CREATE_POSTS,
                description: 'Create posts',
            },
            {
                name: PermissionNames.READ_POSTS,
                description: 'Read posts',
            },
            {
                name: PermissionNames.UPDATE_POSTS,
                description: 'Update posts',
            },
            {
                name: PermissionNames.DELETE_POSTS,
                description: 'Delete posts',
            },
        ];

        const permissions: Permission[] = [];

        for (const permissionDefinition of permissionDefinitions) {
            const existingPermission = await this.permissionRepository.findOneBy({ name: permissionDefinition.name });

            if (existingPermission) {
                permissions.push(existingPermission);
                continue;
            }

            const createdPermission = this.permissionRepository.create(permissionDefinition);
            permissions.push(await this.permissionRepository.save(createdPermission));
        }

        return permissions;
    }

    private async getOrCreateRolePermission(role: Role, permission: Permission): Promise<RolePermission> {
        const existingRolePermission = await this.rolePermissionRepository.findOne({
            where: {
                role: { id: role.id },
                permission: { id: permission.id },
            },
            relations: ['role', 'permission'],
        });

        if (existingRolePermission) {
            return existingRolePermission;
        }

        return await this.rolePermissionRepository.save(
            this.rolePermissionRepository.create({
                role,
                permission,
            }),
        );
    }

    private async getOrCreateUser(input: {
        fullName: string;
        email: string;
        password: string;
        role: Role;
    }): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: input.email }, relations: ['role'] });

        if (existingUser) {
            return existingUser;
        }

        const user = this.userRepository.create({
            fullName: input.fullName,
            email: input.email,
            encryptedPassword: hashSync(input.password, 10),
            role: input.role,
        });

        return await this.userRepository.save(user);
    }

    private async getOrCreatePost(input: { title: string; content: string; author: User }): Promise<Post> {
        const existingPost = await this.postRepository.findOne({
            where: { title: input.title },
            relations: ['author'],
        });

        if (existingPost) {
            return existingPost;
        }

        return await this.postRepository.save(
            this.postRepository.create({
                title: input.title,
                content: input.content,
                author: input.author,
            }),
        );
    }
}
