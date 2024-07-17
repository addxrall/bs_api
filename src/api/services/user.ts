import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

const handleRequest = (
  queryFunction: (id: number) => Promise<any>,
  notFoundMessage: (id: number) => string,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const numericId = Number(id);

    try {
      const result = await queryFunction(numericId);
      if (!result || (Array.isArray(result) && result.length === 0)) {
        return next(
          new AppError(notFoundMessage(numericId), StatusCodes.BAD_REQUEST),
        );
      }
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
};

export const getUserById = handleRequest(
  async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        username: true,
        profile_picture_url: true,
        bio: true,
        location: true,
        created_at: true,
      },
    });
    return user || null;
  },
  (id: number) => `Cannot find user with id: ${id}`,
);

export const getUserBooks = handleRequest(
  async (id: number) => {
    const books = await prisma.book.findMany({ where: { user_id: id } });
    return { books };
  },
  (id: number) => `No books found for user with id: ${id}`,
);

export const getUserReviews = handleRequest(
  async (id: number) => {
    const reviews = await prisma.review.findMany({
      where: { reviewer_id: id },
    });
    return { reviews };
  },
  (id: number) => `No reviews found for user with id: ${id}`,
);
