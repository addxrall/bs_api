import express, { NextFunction, Request, Response } from "express";
import { getUserBooks, getUserById, getUserReviews } from "../services/user";

const router = express.Router();

const handleUserRequest = (
  serviceFunction: (
    req: Request,
    res: Response,
    next: NextFunction,
    id: number,
  ) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await serviceFunction(req, res, next, Number(id));
    } catch (error) {
      next(error);
    }
  };
};

router.get("/:id", handleUserRequest(getUserById));
router.get("/:id/books", handleUserRequest(getUserBooks));
router.get("/:id/reviews", handleUserRequest(getUserReviews));

export default router;
