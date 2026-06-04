import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { PermissionNames } from '../enums/permission-names.enum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    @Permissions(PermissionNames.ADMIN_SUPER_POWER)
    create(createUserInput: CreateUserInput) {
        return 'This action adds a new user';
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    @Permissions(PermissionNames.ADMIN_SUPER_POWER)
    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    @Permissions(PermissionNames.ADMIN_SUPER_POWER)
    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    @Permissions(PermissionNames.ADMIN_SUPER_POWER)
    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async findOneUser(userId: number): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role', 'role.rolesPermissions', 'role.rolesPermissions.permission'],
        });

        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: { email },
            relations: ['role', 'role.rolesPermissions', 'role.rolesPermissions.permission'],
        });

        if (!user) throw new NotFoundException(`User with email ${email} not found`);

        return user;
    }
}
