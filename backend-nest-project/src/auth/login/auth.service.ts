import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/auth/user/user.service';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async login(userLoginDto: UserLoginDto) {
        const user = await this.userService.findByEmailWithRoles(userLoginDto.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passwordMatches = await bcrypt.compare(userLoginDto.password, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const roles = user.usersRoles.map((ur) => ur.role.name);
        const permissions = user.usersRoles
            .flatMap((ur) => ur.role.rolesPermissions)
            .map((rp) => rp.permission.name);
        const uniquePermissions = [...new Set(permissions)];

        const payload = {
            sub: user.id,
            email: user.email,
            roles,
            permissions: uniquePermissions,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };

    }

    async logout() {
        return { message: 'Logged out successfully. Please discard your token on the client.' };
    }
}
