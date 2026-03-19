import { Request, Response } from 'express';
import { BoardDocument } from './board.model';
import { BoardInput } from './dtos/board.inputs.dto';
import { boardService } from './board.service';

class BoardController {
    //Create a board
    public async create(request: Request, response: Response){
        try{
            const newBoard: BoardDocument = await boardService.create(request.body as BoardInput)
            response.status(201).json(newBoard);
        } catch (error) {
            response.status(500).json(error);
        }
    }

    // Get all boards
    public async getAll(request: Request, response: Response) {
        try{
            const boardList: BoardDocument[] = await boardService.getAll();
            response.status(200).json(boardList);
        } catch (error) {
            response.status(500).json({message: "Internal Server Error."});
        }
    }

    //Get board by id
    public async getById(request: Request, response: Response) {
        try{
            const foundBoard = await boardService.findById(request.params.id as string || "");

            if(!foundBoard){
                response.status(404).json({ message: "Entered board ID not found."});
            }

            response.status(200).json(foundBoard);
        } catch (error) {
            response.status(500).json( {message: "Internal Server Error looking for a board by ID: " + error} )
        }
    }

    //Delete board by Id
    public async deleteById(request: Request, response: Response) {
        try{
            const foundBoard = await boardService.deleteById(request.params.id as string || "");

            if(!foundBoard){
                response.status(404).json({ message: "Entered board ID not found."});
            }

            response.status(200).json(foundBoard);
        } catch (error) {
            response.status(500).json( {message: "Internal Server Error looking for a board by ID: " + error} )
        }
    }

    //Update a board
    public async update(request: Request, response: Response) {
        try{
            const foundBoard = await boardService.update(request.params.id as string, request.body as Partial<BoardInput>);

            if(!foundBoard){
                response.status(404).json({ message: "Entered board ID not found."});
                return;
            }

            response.status(200).json(foundBoard);
        } catch (error) {
            response.status(500).json( {message: "Internal Server Error looking for a board by ID: " + error} )
        }
    }
}

export const boardController = new BoardController();