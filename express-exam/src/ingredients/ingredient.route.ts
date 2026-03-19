import Router from 'express';
import { ingredientController } from './ingredient.controller';

export const ingredientRouter = Router();

ingredientRouter.post("/", ingredientController.create);
ingredientRouter.get("/:id", ingredientController.findById);
ingredientRouter.get("/recipe/:id", ingredientController.findByRecipeId);
ingredientRouter.delete("/:id", ingredientController.deleteById);
ingredientRouter.put("/:id", ingredientController.updateById);