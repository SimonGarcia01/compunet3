import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserInputDto } from './dto/user-input.dto';

@Controller('auth')
@UseGuards(AuthGuard('jwt'))
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() userInputDto: UserInputDto) {
        return this.authService.login(userInputDto);
    }
}
