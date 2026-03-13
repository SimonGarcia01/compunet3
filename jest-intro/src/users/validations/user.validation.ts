import { body, param } from "express-validator";
import { validationsMiddleware } from "../../common/middlewares/validations.middleware";

export const userValidation = {
    create: [
        body('name').isString().withMessage('Name must be a string'),
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        validationsMiddleware
    ],
    id: [
        param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
        validationsMiddleware
    ]
}