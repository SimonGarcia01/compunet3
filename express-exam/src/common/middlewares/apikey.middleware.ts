import { NextFunction, Request, Response } from "express";

export const apikeyValidatorMiddleware = (request:Request, response:Response, next: NextFunction) => {
    const apikey = request.headers.api_key || "";

    console.log(apikey);

    if(!apikey){
        response.status(403).json({message: "No API_KEY"});
    }

    if(apikey.length > 20) {
        next();
        return;
    }

    response.status(400).json({message: "API KEY Error"});
}