import mongoose from 'mongoose';
import { ThreadInput } from './dtos/thread.inputs.dto';

//Need a Reply that just holds the message
export interface Reply {
    message: string
}

//Make the document
export interface ThreadDocument extends ThreadInput, mongoose.Document{
    createdAt: Date,
    replies: Reply[]
};

//Need a reply schema so it can be embedded in mongo
const replySchema = new mongoose.Schema({
    message: { type: String, required: true}
});

//Make the Schema
const threadSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    //Referenced version
    boardId: {type: mongoose.Schema.Types.ObjectId, ref: 'Board', required:true},
    //Embedded document
    replies: [replySchema]

}, { timestamps:true, collection: 'threads' });

//Make the model
export const ThreadModel = mongoose.model<ThreadDocument>('Thread', threadSchema);


