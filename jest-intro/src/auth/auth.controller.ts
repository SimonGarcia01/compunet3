import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { UserLoginInput } from "./dto/auth.dto";

class AuthController {
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const token = await authService.login(req.body as UserLoginInput);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const authController = new AuthController();