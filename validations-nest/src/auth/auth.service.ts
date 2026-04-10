import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './user/user.service';
import { UserInputDto } from './dto/user-input.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user: User | null = await this.userService.findByUsername(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.passwordHash !== password) {
            throw new BadRequestException('Invalid password');
        }

        return user;
    }

    async login(userInputDto: UserInputDto) {
        const user = await this.validateUser(userInputDto.username, userInputDto.password);

        //Get the permissions from the user
        //this has to be done with map and not forEach because forEach does not return anything, map returns the array
        const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);

        //make the payload of the token
        const payload = {
            permissions,
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        //Use the jwtService to sign the token and return it
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
