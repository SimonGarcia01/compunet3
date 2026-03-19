import { Request, Response } from 'express';
import { ThreadInput } from './dtos/thread.inputs.dto';
import { threadService } from './thread.service';
import { ThreadDocument } from './thread.model';
import { ReplyInput } from './dtos/reply.inputs.dto';

class ThreadController {
    public async create(request: Request, response: Response) {
        try{
            const newThread: ThreadDocument = await threadService.create(request.body as ThreadInput);
            response.status(201).json(newThread);
        } catch (error) {

            if(error instanceof ReferenceError){
                response.status(404).json({message: "Board not found"});
            }

            response.status(500).json({message: "Couldn't create the thread: " + error });
        }
    }

    public async addReply(request: Request, response: Response) {
        try{
            const updatedThread: ThreadDocument = await threadService.addReply(request.body as ReplyInput);
            response.status(201).json(updatedThread);
        } catch(error) {
            if(error instanceof ReferenceError){
                response.status(404).json({message: "Thread not found"});
            }

            response.status(500).json({message: "Couldn't add the reply: " + error });
        }
    }
}

export const threadController = new ThreadController();