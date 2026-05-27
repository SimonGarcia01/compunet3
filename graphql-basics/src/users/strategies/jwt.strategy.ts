import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UsersService,
		configService: ConfigService
	) {
		super({
			secretOrKey: configService.get<string>('JWT_SECRET') as string,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload;
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}
		return user;
	}
}
