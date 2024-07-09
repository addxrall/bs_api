import express, { NextFunction, Request, Response } from "express";
import { getUserBooks, getUserById, getUserReviews } from "../services/user";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await getUserById(req, res, next, Number(id));
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/books",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await getUserBooks(req, res, next, Number(id));
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id/reviews",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await getUserReviews(req, res, next, Number(id));
    } catch (error) {
      next(error);
    }
  },
);

export default router;
