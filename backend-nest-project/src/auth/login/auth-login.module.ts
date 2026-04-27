import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';

import { User } from 'src/auth/user/entities/user.entity';
import { UserModule } from 'src/auth/user/user.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        UserModule,                             // Para usar UserService.findByEmailWithRoles
        TypeOrmModule.forFeature([User]),       // Para inyectar UserRepository en JwtStrategy
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') ?? 'defaultSecret',
                signOptions: {
                    expiresIn: (config.get<StringValue | number>('JWT_EXPIRES_IN') ?? '1h'),
                },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy],
})
export class AuthLoginModule {}