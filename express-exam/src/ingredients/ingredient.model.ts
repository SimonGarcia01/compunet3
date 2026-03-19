import { InputIngredient } from "./dtos/ingredient.inputs.dto";
import mongoose from "mongoose";

export interface IngredientDocument extends InputIngredient, mongoose.Document{}

const ingredientSchema = new mongoose.Schema({
    recipeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required:true},
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    unit: {type: String, required: true},
    optional: {type: Boolean, default: false, required: true},
    note: {type: String},
}, {collection: 'ingredients'});

export const IngredientModel = mongoose.model<IngredientDocument>('Ingredient', ingredientSchema);