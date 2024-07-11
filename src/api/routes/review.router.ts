import express from "express";
import {
  createReviewForUser,
  deleteUserReview,
  showReviews,
  showUserReviews,
  updateUserReview,
} from "../services/review";
import { createAsyncMiddleware } from "../middleware/createAsyncMiddleware";

const router = express.Router();

router.get("/:reviewed_user_id/show", createAsyncMiddleware(showReviews));
router.get("/show", createAsyncMiddleware(showUserReviews));
router.post(
  "/:reviewed_user_id/new",
  createAsyncMiddleware(createReviewForUser),
);
router.delete("/:review_id/delete", createAsyncMiddleware(deleteUserReview));
router.put("/:review_id/edit", createAsyncMiddleware(updateUserReview));

export default router;
