import { NextFunction, Request, Response } from "express";

export const firstMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('First middleware executed');
    next();
}