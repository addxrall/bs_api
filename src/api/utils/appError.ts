import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
