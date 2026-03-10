import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
    public async login(request: Request, response: Response) {
        try {
            const result = await authService.login(request.body);
            response.status(200).json(result);
        } catch (error) {
            response.status(500).json("Internal Server Error.");
        }
    }    
}

export const authController = new AuthController();