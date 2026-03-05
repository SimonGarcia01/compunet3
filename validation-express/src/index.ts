import express, { Express, Request, Response } from 'express';

import { db } from './config/dbConnection';
import { router as userRouter } from './users/user.route';
import { router as gameRouter } from './games/game.route';
import { firstMiddleware } from './common/middlewares/first.middleware';

const app: Express = express();

process.loadEnvFile();

const port = process.env.APP_PORT || 3000;
//Add the middle ware
app.use(firstMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/games", gameRouter);

app.get("/", (req: Request, res: Response) => {
    res.send('Hola Mundo');
});

db.then(() =>
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
);