import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

export const getUserById = async (
  _: Request,
  res: Response,
  next: NextFunction,
  id: number,
) => {
  const user = await prisma.user.findUnique({ where: { user_id: id } });

  if (!user)
    return next(
      new AppError(`Cannot find user with id: ${id}`, StatusCodes.BAD_REQUEST),
    );

  res.status(StatusCodes.OK).json({ user });
};

export const getUserBooks = async (
  _: Request,
  res: Response,
  next: NextFunction,
  id: number,
) => {
  const books = await prisma.book.findMany({ where: { user_id: id } });

  res.status(StatusCodes.OK).json({ books });
};

export const getUserReviews = async (
  _: Request,
  res: Response,
  next: NextFunction,
  id: number,
) => {
  const reviews = await prisma.review.findMany({ where: { reviewer_id: id } });

  res.status(StatusCodes.OK).json({ reviews });
};
