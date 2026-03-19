import Router from 'express';
import { threadController } from './thread.controller';

//Make the router
export const threadRouter = Router();

//Make the routes
threadRouter.post("/", threadController.create);
threadRouter.post("/reply", threadController.addReply);