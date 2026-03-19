import { BoardModel } from "../boards/board.model";
import { ReplyInput } from "./dtos/reply.inputs.dto";
import { ThreadInput } from "./dtos/thread.inputs.dto";
import { ThreadDocument, ThreadModel } from "./thread.model";

class ThreadService {
    public async create(threadInput: ThreadInput): Promise<ThreadDocument>{
        //First I must look for the board
        const board = await BoardModel.findById(threadInput.boardId);

        if(!board) {
            throw new ReferenceError("The entered board doesn't exist");
        }
        
        return ThreadModel.create(threadInput);
    }

    public async addReply(replyInput: ReplyInput): Promise<ThreadDocument> {
        const thread = await ThreadModel.findByIdAndUpdate(
            replyInput.threadId,
            {
                $push: {
                    replies: { message: replyInput.message }
                }
            },
            {new: true}
        );

        if(!thread){
            throw new ReferenceError("The entered thread doesn't exist");
        }

        return thread;
    }
}
export const threadService = new ThreadService();