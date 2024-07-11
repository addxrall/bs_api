import express, { NextFunction, Request, Response } from "express";
import {
  createReviewForUser,
  deleteUserReview,
  showReviews,
  showUserReviews,
  updateUserReview,
} from "../services/review";

const router = express.Router();

const handleReviewRequest = (
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

router.get("/:reviewed_user_id/show", handleReviewRequest(showReviews));
router.get("/show", handleReviewRequest(showUserReviews));
router.post("/:reviewed_user_id/new", handleReviewRequest(createReviewForUser));
router.delete("/:review_id/delete", handleReviewRequest(deleteUserReview));
router.put("/:review_id/edit", handleReviewRequest(updateUserReview));

export default router;
