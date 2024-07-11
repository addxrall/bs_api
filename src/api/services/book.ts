import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/verifyToken";
import { NewBookData } from "../interfaces";
import { handleAsync, handleError } from "../utils";

const prisma = new PrismaClient();

export const addBook = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookData: NewBookData = req.body;
    const token = req.cookies.token;

    if (!bookData)
      return handleError(
        next,
        "Fields cannot be empty",
        StatusCodes.BAD_REQUEST,
      );

    const { user_id } = verifyToken(token);

    if (!user_id)
      return handleError(next, "Cannot get user id", StatusCodes.BAD_REQUEST);

    await prisma.book.create({
      data: {
        ...bookData,
        user_id,
      },
    });

    res.status(StatusCodes.CREATED).json({ message: "New book offer created" });
  },
);

export const deleteBook = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { book_id } = req.params;
    const token = req.cookies.token;
    const id = Number(book_id);
    const { user_id } = verifyToken(token);

    const bookToDelete = await prisma.book.findUnique({
      where: { book_id: id },
    });

    if (!bookToDelete)
      return handleError(
        next,
        `Cannot find book with id ${id}`,
        StatusCodes.NOT_FOUND,
      );

    if (user_id !== bookToDelete.user_id) {
      handleError(
        next,
        "This book doesn't belong to this user",
        StatusCodes.FORBIDDEN,
      );
    }

    await prisma.swapRequest.deleteMany({
      where: { book_id: id },
    });

    await prisma.book.delete({
      where: { book_id: id },
    });

    res.status(StatusCodes.OK).json({ message: `Book with id: ${id} deleted` });
  },
);
