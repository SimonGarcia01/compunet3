import { Request, Response } from 'express';
import { InputRecipe } from './dtos/recipe.input.dto';
import { RecipeDocument } from './recipe.model';
import { recipeService } from './recipe.service';

class RecipeController {
    public async create(request: Request, response:Response){
        try{
            const newRecipe = await recipeService.create(request.body as InputRecipe);
            response.status(201).json(newRecipe);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error making a Recipe" });
        }
    }
    
    public async findAll(request: Request, response:Response){
        try{
            const recipes:RecipeDocument[] = await recipeService.findAll();
            response.status(201).json(recipes);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error finding recipes" });
        }

    }

    public async findById(request: Request, response:Response){
        try{
            const recipe = await recipeService.findById(request.params.id as string);
            response.status(201).json(recipe);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error finding recipe by id" });
        }
    }

    public async deleteById(request: Request, response:Response){
        try{
            const recipe = await recipeService.deleteById(request.params.id as string);
            response.status(201).json(recipe);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error deleting a recipe" });
        }
    }

    public async updateById(request: Request, response:Response){
        try{
            const recipe = await recipeService.updateById(request.params.id as string, request.body as Partial<InputRecipe>);
            response.status(201).json(recipe);
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error updating a recipe" });
        }
    }

}

export const recipeController = new RecipeController();