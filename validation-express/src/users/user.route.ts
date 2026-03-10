import express from "express";
import { userController } from "./user.controller";
import { userValidation } from "./validations/user.validations";
import { authMiddleware } from "../common/middlewares/auth.middleware";

export const router = express.Router();

//Add the authToken middleware to require authorization
router.get("/", authMiddleware, userController.getAll);

router.get("/:id", userController.getOne);

//You can add the middleware to validate the ID
router.put("/:id", userValidation.id, userController.update);

//You can add the middleware for validation of the body
router.post("/", userValidation.create, userController.create);

//Re use the ID validation middleware for delete
router.delete("/:id", userValidation.id, userController.delete);