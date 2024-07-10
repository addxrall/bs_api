import { StatusCodes } from "http-status-codes";
import { AppError } from "./appError";
import { UserDataFromToken } from "../interfaces/user";
import jwt from "jsonwebtoken";

const key = process.env.JWT;

if (!key) {
  throw new AppError(
    "Cannot get jwt from server",
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

export const verifyToken = (token: string): UserDataFromToken => {
  return jwt.verify(token, key) as UserDataFromToken;
};

export const getUserIdFromToken = (token: string): number => {
  const userData = verifyToken(token);
  return userData.user_id;
};

export const getEmailFromToken = (token: string): string => {
  const userData = verifyToken(token);
  return userData.email;
};
