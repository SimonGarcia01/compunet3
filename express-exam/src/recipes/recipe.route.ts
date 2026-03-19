import Router from 'express';
import { recipeController } from './recipe.controller';

export const recipeRouter = Router();

recipeRouter.post("/", recipeController.create);
recipeRouter.get("/", recipeController.findAll);
recipeRouter.get("/:id", recipeController.findById);
recipeRouter.put("/:id", recipeController.updateById);
recipeRouter.delete("/:id", recipeController.deleteById);