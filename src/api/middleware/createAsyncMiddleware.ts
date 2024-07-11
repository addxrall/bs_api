import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const createAsyncMiddleware = (serviceFunction: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await serviceFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
