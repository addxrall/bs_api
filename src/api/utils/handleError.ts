import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./appError";

export const handleError = (
  next: NextFunction,
  message: string,
  statusCode: StatusCodes,
) => {
  return next(new AppError(message, statusCode));
};
