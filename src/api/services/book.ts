import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { verifyToken } from "../utils/verifyToken";
import { NewBookData } from "../interfaces";

const prisma = new PrismaClient();

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookData: NewBookData = req.body;
  const token = req.cookies.token;

  if (!bookData)
    return next(
      new AppError("Fields cannot be empty", StatusCodes.BAD_REQUEST),
    );

  try {
    const { user_id } = verifyToken(token);

    if (!user_id)
      return next(new AppError("Cannot get user id", StatusCodes.BAD_REQUEST));

    await prisma.book.create({
      data: {
        ...bookData,
        user_id,
      },
    });

    res.status(StatusCodes.CREATED).json({ message: "New book offer created" });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const token = req.cookies.token;

  try {
    const { user_id } = verifyToken(token);

    const bookToDelete = await prisma.book.findUnique({
      where: { book_id: Number(id) },
    });

    if (!bookToDelete)
      return next(
        new AppError(`Cannot find book with id ${id}`, StatusCodes.NOT_FOUND),
      );

    if (user_id !== bookToDelete.user_id)
      return next(
        new AppError(
          "This book doesn't belong to this user",
          StatusCodes.FORBIDDEN,
        ),
      );

    await prisma.book.delete({
      where: {
        book_id: bookToDelete.book_id,
      },
    });

    res.status(StatusCodes.OK).json({ message: `Book with id: ${id} deleted` });
  } catch (error) {
    next(error);
  }
};
