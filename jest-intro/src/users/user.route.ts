import express from "express";
import { userController } from "./user.controller";
import { userValidation } from "./validations/user.validation";
import { transformMiddleware } from "../common/middlewares/transform.middleware";
import authMiddleware from "../common/middlewares/auth.middleware";

export const router = express.Router();

router.get("/", authMiddleware, transformMiddleware, userController.getAll);

router.get("/:id", userValidation.id, userController.getOne);

router.put("/:id", userValidation.id, userController.update);

router.post("/", userValidation.create, userController.create);

router.delete("/:id", userValidation.id, userController.delete);