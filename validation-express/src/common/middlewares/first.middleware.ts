import {Request, Response, NextFunction} from 'express';

export const firstMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("Entered the middle ware");
    next();
}