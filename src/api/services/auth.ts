import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();
const jwtKey = process.env.JWT;

export const register = async (
  { username, email, password }: any,
  res: Response,
  next: NextFunction,
) => {
  if (!username || !password || !email) {
    return next(new AppError("No data", StatusCodes.INTERNAL_SERVER_ERROR));
  }

  if (!jwtKey) {
    return next(
      new AppError(
        "Failed to load jwt from server",
        StatusCodes.SERVICE_UNAVAILABLE,
      ),
    );
  }

  const userEmailDoesExist = await prisma.user.findUnique({
    where: { email },
  });
  const existingUserUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (userEmailDoesExist) {
    return next(new AppError("Email is already in use", StatusCodes.CONFLICT));
  }

  if (existingUserUsername) {
    return next(
      new AppError("Username is already in use", StatusCodes.CONFLICT),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  res.send({ status: StatusCodes.OK, user: newUser });
};
