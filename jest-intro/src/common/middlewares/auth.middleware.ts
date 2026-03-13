import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtCustomPayload } from '../../types';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'defaultSecret';
        const decoded = jwt.verify(token, secretKey) as JwtCustomPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;