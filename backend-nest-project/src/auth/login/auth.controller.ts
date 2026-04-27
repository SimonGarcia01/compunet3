import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /** POST /auth/login — pública */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesion y obtener token JWT' })
    @ApiResponse({ status: 200, description: 'Login exitoso, retorna access_token' })
    @ApiResponse({ status: 401, description: 'Contrasena incorrecta' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    login(@Body() userLoginDto: UserLoginDto) {
        return this.authService.login(userLoginDto);
    }

    /** POST /auth/logout — requiere token válido */
    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cerrar sesion (requiere token valido)' })
    @ApiResponse({ status: 200, description: 'Logout exitoso' })
    @ApiResponse({ status: 401, description: 'Token invalido o no proporcionado' })
    logout() {
        return this.authService.logout();
    }
}