import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import recommendationRouter from './routers/recommendationRouter.js';
import e2eRouter from './routers/e2eRouter.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express().use(cors()).use(express.json());

app.use('/recommendations', recommendationRouter);

if (process.env.NODE_ENV === 'test') {
  app.use(e2eRouter);
}

app.use(errorHandlerMiddleware);

export default app;
