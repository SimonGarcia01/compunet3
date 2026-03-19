import { InputIngredient } from "./dtos/ingredient.inputs.dto";
import { IngredientDocument, IngredientModel } from "./ingredient.model";

class IngredientService{
    public async updateById(id: string, updateIngredient: Partial<InputIngredient>): Promise<IngredientDocument | null> {
        return IngredientModel.findByIdAndUpdate(
            {_id: id},
            updateIngredient,
            {new: true}
        );
    }

    public async deleteById(id: string): Promise<IngredientDocument | null> {
        return IngredientModel.findByIdAndDelete(id);
    }

    public async findById(id: string): Promise<IngredientDocument | null> {
        return IngredientModel.findById(id);
    }

    public async findByRecipeId(id: string): Promise<IngredientDocument[]> {
        return IngredientModel.find({recipeId:id});
    }

    public async create(inputIngredient: InputIngredient): Promise<IngredientDocument | null> {
        return IngredientModel.create(inputIngredient);
    }
}

export const ingredientService = new IngredientService();