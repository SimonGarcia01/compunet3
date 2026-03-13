import { NextFunction, Request, Response } from "express";

export const transformMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('Transform middleware executed');
    // Encapsulate response in a body like { data: ... }
    const originalJson = res.json.bind(res);
    res.json = (data: unknown) => {
        return originalJson({ data })
    };
    next();
}