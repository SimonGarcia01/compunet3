import { InputRecipe } from "./dtos/recipe.input.dto";
import { RecipeDocument, RecipeModel } from "./recipe.model";

class RecipeService {
    public async updateById(id: string, updateRecipe: Partial<InputRecipe>): Promise<RecipeDocument | null> {
        return RecipeModel.findByIdAndUpdate(
            {_id: id},
            updateRecipe,
            {new: true}
        );
    }

    public async deleteById(id: string): Promise<RecipeDocument | null> {
        return RecipeModel.findByIdAndDelete(id);
    }

    public async findById(id: string): Promise<RecipeDocument | null> {
        return RecipeModel.findById(id);
    }

    public async findAll(): Promise<RecipeDocument[]> {
        return RecipeModel.find();
    }

    public async create(inputRecipe: InputRecipe): Promise<RecipeDocument | null> {
        return RecipeModel.create(inputRecipe);
    }

}

export const recipeService = new RecipeService();