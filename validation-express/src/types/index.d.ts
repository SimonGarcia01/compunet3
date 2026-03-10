import { JwtPayload } from "jsonwebtoken";

//Here we are defining a custom type from the JwtPayload
//This is so we can extend the JwtPayload and add out custom properties to it (id, roles, etc)
//So then we can use this custom type in the auth middleware to attach the user info to the request object 
// and have it typed correctly
export type CustomJwtPayload = {
    id: string,
    roles: string[]
} & JwtPayload;

//This uses the global namespace to edit the Express Request type and add our custom user property
// This way we can have the user property available in all out controllers and middlewares
declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload
        }
    }
}