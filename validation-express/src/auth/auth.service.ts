import { LoginInput } from "./dto/auth.dto";
import { userService } from "../users/user.service";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {

    public async login(loginInput: LoginInput) {
        //Verify the user exists
        //The true is so the password is includded
        const userFound = await userService.findByEmail(loginInput.email, true)

        if(!userFound) {
            throw new Error("User not found!");
        }

        //Match the passwords using the user
        const isMatch = await bcrypt.compare(loginInput.password, userFound.password);

        if(!isMatch){
            throw new Error("Password mismatch!");
        }

        //Return the jwt token with the user info
        return {
            token: this.generateToken(userFound)
        }
    }

    public generateToken(user: any) {
        const payload = {
            id: user._id,
            roles: user.roles
        };

        // Return the JWT token
        return jwt.sign(payload, process.env.JWT_SECRET || 'defaultsecret', { 
            expiresIn: '1h' 
        });
    }
}

export const authService = new AuthService();