import { StatusCodes } from "http-status-codes";
import { AppError } from "./appError";
import { UserDataFromToken } from "../interfaces/user";
import jwt from "jsonwebtoken";

const key = process.env.JWT;
export const verifyToken = (token: string): UserDataFromToken => {
  if (!key)
    throw new AppError(
      "Cannot get jwt from server",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  return jwt.verify(token, key) as UserDataFromToken;
};
