import { GameInput, GameInputUpdate } from "./dto/game.interface";
import { GameDocument, GameModel } from "./game.model";
import { UserModel } from "../users/user.model";

class GamesService {
    public async create(gameInput: GameInput): Promise<GameDocument> {
        // Verificar que el usuario que crea el juego existe
        const userExists = await UserModel.findById(gameInput.createdBy);
        if (!userExists) {
            throw new ReferenceError("User not found");
        }

        return GameModel.create(gameInput);
    }

    public async update(id: string, gameInput: GameInputUpdate): Promise<GameDocument | null> {
        try {
            const game: GameDocument | null = await GameModel.findOneAndUpdate(
                { _id: id },
                gameInput,
                { new: true }
            );

            return game;
        } catch (error) {
            throw error;
        }
    }

    public getAll(): Promise<GameDocument[]> {
        return GameModel.find().populate('createdBy', 'name email');
    }

    public getById(id: string): Promise<GameDocument | null> {
        return GameModel.findById(id).populate('createdBy', 'name email');
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const result = await GameModel.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw error;
        }
    }

    public getByUserId(userId: string): Promise<GameDocument[]> {
        return GameModel.find({ createdBy: userId }).populate('createdBy', 'name email');
    }

    public getByGenre(genre: string): Promise<GameDocument[]> {
        // Usamos una expresión regular para hacer una búsqueda insensible a mayúsculas y minúsculas
        // Options 'i' hace que la búsqueda sea insensible a mayúsculas
        return GameModel.find({ genre: { $regex: genre, $options: 'i' } }).populate('createdBy', 'name email');
    }
}

export const gamesService = new GamesService();