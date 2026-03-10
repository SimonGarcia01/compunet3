import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "../../types/index";

dotenv.config();

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    //Get the token from the Authorization header
    //Make the token optional
    //Then get the actual token from the "bearer token"
    const token = request.headers.authorization?.split(" ")[1];

    if(!token){
        return response.status(403).json({ message: "The token was not found!"});
    }

    //Now we have to decode the info for the next information to be able to use it in the other controllers
    try{
        //Added the default secret key for development as an option if the environment variable is not set
        const secretKey = process.env.JWT_SECRET || "default_secret_key";
        const decode = jwt.verify(token, secretKey) as CustomJwtPayload;

        //Now we can attach the decoded info
        //But in order to attach the info we have to extend the Request
        request.user = decode;
        next();
    } catch (Error) {
        return response.status(401).json({ message: "Invalid token!"});
    }
}