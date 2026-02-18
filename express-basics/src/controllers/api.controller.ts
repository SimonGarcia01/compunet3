import { Request, Response } from "express";

export class ApiController {

    //standard func
    sayHello(request: Request, response:Response) {
        try{
            const bodyResponse = {
                status:200,
                message: "Hello World"
            }

            response.status(200).json(bodyResponse);
        } catch(error) {
            console.log(error);
        }
    }
}