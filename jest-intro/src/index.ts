import express, { Express, NextFunction, Request, Response } from 'express';

import { db } from './config/dbConnection';
import { router as userRouter } from './users/user.route';
import { router as gameRouter } from './games/game.route';
import { router as authRouter } from './auth/auth.route';
import { firstMiddleware } from './common/middlewares/first.middleware';

const app: Express = express();

process.loadEnvFile();

const port = process.env.APP_PORT || 3000;

app.use(firstMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/games", gameRouter);
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.send('Hola Mundo');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Global middleware executed');
    console.log(`Request method: ${req.method}, Request path: ${req.path}`);
    next();
});


db.then(() =>
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
);