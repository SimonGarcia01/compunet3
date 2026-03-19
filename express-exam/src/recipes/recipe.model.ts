import mongoose from "mongoose";
import { Difficulty, InputRecipe } from "./dtos/recipe.input.dto";

export interface RecipeDocument extends InputRecipe, mongoose.Document{}

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    difficulty: {type: String, enum:Object.values(Difficulty)},
    preparationTimeMinutes: {type: Number},
    servings: {type: Number}
}, {timestamps: true, collection: 'recipe'});

export const RecipeModel = mongoose.model<RecipeDocument>("Recipe", recipeSchema);