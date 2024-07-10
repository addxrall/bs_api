import express, { NextFunction, Request, Response } from "express";
import { addBook, deleteBook } from "../services/book";

const router = express.Router();

const handleBookRequest = (
  serviceFunction: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await serviceFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

router.post("/add", handleBookRequest(addBook));
router.delete("/:id/delete", handleBookRequest(deleteBook));

export default router;
