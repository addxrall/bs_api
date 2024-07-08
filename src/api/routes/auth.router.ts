import express, { NextFunction, Request, Response } from "express";
import { register } from "../services/auth";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "auth test" });
});

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await register(req.body, res);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
