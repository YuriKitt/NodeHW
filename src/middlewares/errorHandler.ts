import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  next(err);
};
