import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userService } from "../users/user.service";
import { UserLoginInput } from "./dto/auth.dto";
import { UserDocument } from "../users/user.model";

class AuthService {
    public async login(userLogin: UserLoginInput) {
        // Buscar el usuario por correo
        // Verificar la contraseña
        // Generar y devolver el token JWT
        // Retornar una respuesta
        const userExists = await userService.findByEmail(userLogin.email, true);
        if (!userExists) {
            throw new Error("Usuario no encontrado");
        }
        const isMatch = await bcrypt.compare(userLogin.password, userExists.password);
        if (!isMatch) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            id: userExists._id,
            roles: userExists.roles,
            token: await this.generateToken(userExists)
        }
    }

    public async generateToken(user: UserDocument) {
        const payload = {
            id: user._id,
            roles: user.roles,
        }

        return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
    }
}

export const authService = new AuthService();