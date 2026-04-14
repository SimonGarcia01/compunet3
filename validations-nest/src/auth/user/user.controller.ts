import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    InternalServerErrorException,
    Header,
    Headers,
    HttpCode,
    HttpStatus,
    UseGuards,
    //     UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// import { CryptoInterceptor } from '@/common/interceptors/crypto.interceptor';
import { PositiveIntPipe } from '@/common/pipes/positive-int.pipe';
import { PermissionsGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserParams } from './dto/get-user-params.dto';

@Controller('users')
// @UseInterceptors(CryptoInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.userService.create(createUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user', {
                cause: error,
                description: 'An error occurred while creating the user.',
            });
        }
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('readd')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        try {
            return await this.userService.findAll();
        } catch (error) {
            throw new InternalServerErrorException('Failed to get users', {
                cause: error,
                description: 'An error occurred while fetching users.',
            });
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param() param: GetUserParams) {
        try {
            console.info('Fetching user with ID:', param.id);
            return await this.userService.findOne(param.id);
        } catch (error) {
            throw new InternalServerErrorException('Failed to get user', {
                cause: error,
                description: 'An error occurred while fetching the user.',
            });
        }
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: GetUserParams, @Body() updateUserDto: UpdateUserDto) {
        try {
            return await this.userService.update(param.id, updateUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user', {
                cause: error,
                description: 'An error occurred while updating the user.',
            });
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', PositiveIntPipe) id: number) {
        try {
            console.info('Deleting user with ID:', id, typeof id);
            await this.userService.remove(id);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete user', {
                cause: error,
                description: 'An error occurred while deleting the user.',
            });
        }
    }

    @Get('test/info')
    @HttpCode(HttpStatus.AMBIGUOUS)
    @Header('Custom-Header', 'CustomHeaderValue')
    test(@Headers('Content-Type') contentType: string) {
        try {
            console.info('Content-Type:', contentType);
            return 'Test endpoint';
        } catch (error) {
            throw new InternalServerErrorException('Failed in test endpoint', {
                cause: error,
                description: 'An error occurred while executing test endpoint.',
            });
        }
    }
}
