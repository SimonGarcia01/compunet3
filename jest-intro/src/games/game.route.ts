import express from "express";
import { gamesController } from "./game.controller";

export const router = express.Router();

router.get("/user/:userId", gamesController.getByUserId);
router.get("/genre/:genre", gamesController.getByGenre);

router.get("/", gamesController.getAll);
router.get("/:id", gamesController.getOne);
router.post("/", gamesController.create);
router.put("/:id", gamesController.update);
router.delete("/:id", gamesController.delete);
