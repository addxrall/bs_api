import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const jwtKey = process.env.JWT;

export const register = async (
  { username, email, password }: any,
  res: Response,
) => {
  if (!username || !password || !email) {
    throw new Error("No data");
  }

  if (!jwtKey) {
    throw new Error("Failed to load jwt from server");
  }

  const userEmailDoesExist = await prisma.user.findUnique({
    where: { email },
  });
  const existingUserUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (userEmailDoesExist) {
    throw new Error("Email is already in use");
  }

  if (existingUserUsername) {
    throw new Error("Username is already in use");
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
