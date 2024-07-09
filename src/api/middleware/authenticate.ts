import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const key = process.env.JWT;
const prisma = new PrismaClient();

interface emailFromTokenI {
  email: string;
}

export const authenticate = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!key)
    return next(new AppError("No jwt key", StatusCodes.INTERNAL_SERVER_ERROR));

  if (!token)
    return next(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED));

  try {
    const decoded = jwt.verify(token, key) as emailFromTokenI;
    const { email } = decoded;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) next();
  } catch (error) {
    next(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED));
  }
};
