import express, { NextFunction, Request, Response } from "express";
import { login, logout, register } from "../services/auth";

const router = express.Router();

const handleAuthRequest = (
  serviceFunction: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      await serviceFunction(data, res, next);
    } catch (error) {
      next(error);
    }
  };
};

router.post("/register", handleAuthRequest(register));
router.post("/login", handleAuthRequest(login));
router.post("/logout", async (_: Request, res: Response) => {
  await logout(res);
});

export default router;
