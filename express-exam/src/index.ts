import express, {Express} from 'express';
import { db } from './config/dbConnection';

import dotenv from 'dotenv';
import { recipeRouter } from './recipes/recipe.route';
import { ingredientRouter } from './ingredients/ingredient.route';
import { apikeyValidatorMiddleware } from './common/middlewares/apikey.middleware';
dotenv.config;

const app: Express = express();

const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apikeyValidatorMiddleware);
app.use("/api/recipe", recipeRouter);
app.use("/api/ingredient", ingredientRouter);

db.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    });
});