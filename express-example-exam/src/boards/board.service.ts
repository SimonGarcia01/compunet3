import { BoardDocument, BoardModel } from "./board.model";
import { BoardInput } from "./dtos/board.inputs.dto";

class BoardService {
    public async create(boardInput: BoardInput): Promise<BoardDocument> {
        return BoardModel.create(boardInput);
    }

    public async getAll(): Promise<BoardDocument[]> {
        return BoardModel.find();
    }

    public async findById(id:string): Promise<BoardDocument | null> {
        return BoardModel.findById(id);
    }

    public async deleteById(id:string): Promise<BoardDocument | null> {
        return BoardModel.findByIdAndDelete(id);
    }

    public async update(id:string, updateBoard: Partial<BoardInput>): Promise<BoardDocument | null>{
        if(!id || !updateBoard){
            return null;
        }

        return BoardModel.findByIdAndUpdate(
            {_id: id},
            updateBoard,
            {returnOriginal: false}
        );
    }
    
}

export const boardService = new BoardService();