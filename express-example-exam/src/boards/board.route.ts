import { Router } from "express";
import { boardController } from "./board.controller";

//Make the router
export const boardRouter = Router();

//Define the routes
boardRouter.post("/", boardController.create);
boardRouter.get("/", boardController.getAll);
boardRouter.get("/:id", boardController.getById);
boardRouter.delete("/:id", boardController.deleteById);
boardRouter.patch("/:id", boardController.update)