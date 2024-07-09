import express, { NextFunction, Request, Response } from "express";
import { login, logout, register } from "../services/auth";

const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await register(req.body, res, next);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await login(req.body, res, next);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/logout", async (_: Request, res: Response) => {
  await logout(res);
});

export default router;
