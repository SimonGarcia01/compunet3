import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { UserInput } from './dtos/updateUser.dto';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findById(parseInt(id));
    }

    @Post()
    create(@Body() createUserDto: UserInput) {
        return this.userService.create(createUserDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUser: Partial<UserInput>) {
        return this.userService.update(id, updateUser);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}
