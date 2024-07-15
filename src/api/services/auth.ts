import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import { UserLoginData, UserRegisterData } from "../interfaces/user";
import { getUserIdFromToken, handleError, verifyToken } from "../utils";

const prisma = new PrismaClient();
const jwtKey = process.env.JWT;

export const register = async (
  { username, email, password }: UserRegisterData,
  res: Response,
  next: NextFunction,
) => {
  if (!username || !password || !email) {
    return next(new AppError("No data", StatusCodes.BAD_REQUEST));
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

  const token = jwt.sign(
    { user_id: newUser.user_id, email: newUser.email },
    jwtKey,
    {
      expiresIn: "2h",
    },
  );

  res.cookie("token", token, {
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({ token });
};

export const login = async (
  { email, password }: UserLoginData,
  res: Response,
  next: NextFunction,
) => {
  if (!email || !password) {
    return next(new AppError("Empty credentials", StatusCodes.BAD_REQUEST));
  }

  if (!jwtKey) {
    return next(
      new AppError(
        "Failed to load jwt from server",
        StatusCodes.SERVICE_UNAVAILABLE,
      ),
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError("Invalid Email", StatusCodes.BAD_REQUEST));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return next(new AppError("Invalid Password", StatusCodes.BAD_REQUEST));
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      jwtKey,
      {
        expiresIn: "2h",
      },
    );

    res.cookie("token", token, {
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    return next(
      new AppError("Login failed", StatusCodes.INTERNAL_SERVER_ERROR),
    );
  }
};

export const logout = async (res: Response) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({ message: "Logout Successfull" });
};

export const session = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token)
    return handleError(
      next,
      "Authentication token is missing",
      StatusCodes.UNAUTHORIZED,
    );

  const user = verifyToken(token);

  if (!user) {
    return handleError(
      next,
      "Invalid or expired token",
      StatusCodes.UNAUTHORIZED,
    );
  }

  res.status(StatusCodes.OK).json(user);
};
