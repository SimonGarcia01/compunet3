import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './user/user.service';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email); // Asegúrate de tener un método `findByEmail` en tu servicio de usuarios
        if (!user) throw new NotFoundException('User not found');

        const matches = await bcrypt.compare(password, user.passwordHash);
        if (!matches) throw new UnauthorizedException('Invalid credentials');
        /* Deberías omitir el password al retornarselo al usuario o,o */
        return user;
    }

    async login(userLoginDto: UserLoginDto) {
        // Asegúrate de tener un DTO para el login que contenga email y password
        const user = await this.validateUser(userLoginDto.email, userLoginDto.password);

        const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);
        const payload = { sub: user.id, email: user.email, permissions };
        return { access_token: this.jwtService.sign(payload) };
    }
}
