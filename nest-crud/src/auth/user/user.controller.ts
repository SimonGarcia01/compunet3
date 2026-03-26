import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { UserInput, UserInputNameRole } from './dtos/createUser.dto';

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

    //Create method to make a user
    @Post()
    //This uses the @Body decorator to get data from the request body
    create(@Body() createUserDto: UserInput) {
        return this.userService.create(createUserDto);
    }

    //Added this method to make a user using the role name
    @Post('/with-role-name')
    //That UserInputNameRole DTO is the one validated
    createWithRoleName(@Body() createUserDto: UserInputNameRole) {
        //This will call the service method that creates the user with the role name instead of the ID
        return this.userService.createWithRoleName(createUserDto);
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
