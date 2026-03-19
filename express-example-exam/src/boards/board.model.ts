import mongoose from 'mongoose';
import { BoardInput } from './dtos/board.inputs.dto';

//Make the board document
//The input + the added property for the document
export interface BoardDocument extends BoardInput, mongoose.Document{
    createdAt: Date
};

//Make the Schema
const boardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
}, {timestamps: true, collection: 'boards' });

//Make the model to access the db (make it BoardDocument type and inject the schema)
export const BoardModel = mongoose.model<BoardDocument>('Board', boardSchema);