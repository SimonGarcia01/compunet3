import express, { Express, Request, Response, NextFunction } from 'express';
import { db } from './config/dbConnection';

import dotenv from 'dotenv';
import { boardRouter } from './boards/board.route';
import { threadRouter } from './threads/thread.route';
dotenv.config;

const app: Express = express();

const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/boards", boardRouter);
app.use("/api/threads", threadRouter);

db.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    });
});