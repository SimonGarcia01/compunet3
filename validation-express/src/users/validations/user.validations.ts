import { body, param } from "express-validator";
import { validationMiddleware } from "../../common/middlewares/validation.middleware";

export const userValidation = {
    create: [
        body("name").isString().withMessage("Name must be a string"),
        body("email").isEmail().withMessage("Email must be valid"),
        body("password").isLength({ min:6, max: 20 }).withMessage("Password must be between 6 and 20 characters"),
        validationMiddleware
    ],
    id: [
        param("id").isMongoId().withMessage("ID must be a valid MongoDB ObjectID"),
        validationMiddleware
    ]
};