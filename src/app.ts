import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConnection from './database';
import AppError from './errors/AppError';
import { routes } from './routes';
import { Request, Response, NextFunction} from 'express'

createConnection();
const app = express();

app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message
      })
    }

    console.error(err)

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
)

export { app };