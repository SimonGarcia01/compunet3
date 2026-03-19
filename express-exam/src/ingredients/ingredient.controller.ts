import { Request, Response } from "express";
import { InputIngredient } from "./dtos/ingredient.inputs.dto";
import { IngredientDocument } from "./ingredient.model";
import { ingredientService } from "./ingredient.service";

class IngredientController {

    public async create(request: Request, response:Response){
        try{
            const newIngredient = await ingredientService.create(request.body as InputIngredient);
            response.status(201).json(newIngredient);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error making an Ingredient" });
        }
    }

    public async findById(request: Request, response:Response){
        try{
            const ingredient = await ingredientService.findById(request.params.id as string);
            response.status(201).json(ingredient);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error finding ingredient by id" });
        }
    }

    public async findByRecipeId(request: Request, response:Response){
        try{
            const ingredients:IngredientDocument[] = await ingredientService.findByRecipeId(request.params.id as string);
            response.status(201).json(ingredients);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error finding ingredient by id" });
        }
    }

    public async deleteById(request: Request, response:Response){
        try{
            const ingredient = await ingredientService.deleteById(request.params.id as string);
            response.status(201).json(ingredient);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error deleting a ingredient" });
        }
    }

    public async updateById(request: Request, response:Response){
        try{
            const ingredient = await ingredientService.updateById(request.params.id as string, request.body as Partial<InputIngredient>);
            response.status(201).json(ingredient);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error updating a ingredient" });
        }
    }

}

export const ingredientController = new IngredientController();