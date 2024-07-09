import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  return res
    .status(statusCode)
    .json({ status: statusCode, message: error.message });
};
