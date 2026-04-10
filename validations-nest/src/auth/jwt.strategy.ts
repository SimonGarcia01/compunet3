import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from './user/user.service';

interface JwtPayload {
    sub: number;
    username: string;
    permissions: string[];
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        private readonly userService: UserService,
    ) {
        const jwtSecret = config.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
