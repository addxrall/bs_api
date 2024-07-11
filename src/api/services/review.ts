import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { getUserIdFromToken } from "../utils/verifyToken";
import { handleError } from "../utils/handleError";
import { ReviewData } from "../interfaces";
import { handleAsync } from "../utils";
import prisma from "../utils/prisma";

export const createReviewForUser = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const { reviewed_user_id } = req.params;
    const { rating, review_text }: ReviewData = req.body;
    const user_id = getUserIdFromToken(token);
    const id = Number(reviewed_user_id);

    if (!id) {
      return handleError(
        next,
        "Cannot get id from params",
        StatusCodes.NOT_FOUND,
      );
    }

    if (id === user_id) {
      return handleError(
        next,
        "Cannot create a review for the same user",
        StatusCodes.BAD_REQUEST,
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        reviewed_user_id: id,
        reviewer_id: user_id,
      },
    });

    if (existingReview) {
      return handleError(
        next,
        "You have already reviewed this user",
        StatusCodes.BAD_REQUEST,
      );
    }

    const acceptedSwapRequest = await prisma.swapRequest.findFirst({
      where: {
        requester_id: user_id,
        book: {
          user_id: id,
        },
        status: "accepted",
      },
    });

    if (!acceptedSwapRequest) {
      return handleError(
        next,
        "No accepted swap request found between these users",
        StatusCodes.BAD_REQUEST,
      );
    }

    const review = await prisma.review.create({
      data: {
        reviewed_user_id: id,
        reviewer_id: user_id,
        rating,
        review_text,
      },
    });

    res.status(StatusCodes.CREATED).json({ message: "Review created", review });
  },
);

export const showReviews = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewed_user_id } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        reviewed_user_id: parseInt(reviewed_user_id),
      },
      select: {
        rating: true,
        review_text: true,
        created_at: true,
        reviewer: {
          select: {
            username: true,
            profile_picture_url: true,
          },
        },
      },
    });

    res.status(StatusCodes.OK).json({ reviews });
  },
);

export const showUserReviews = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);

    const reviews = await prisma.review.findMany({
      where: {
        reviewer_id: user_id,
      },
      select: {
        rating: true,
        review_text: true,
        created_at: true,
        reviewer: {
          select: {
            username: true,
            profile_picture_url: true,
          },
        },
      },
    });

    res.status(StatusCodes.OK).json({ reviews });
  },
);

export const deleteUserReview = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { review_id } = req.params;
    const id = Number(review_id);

    const review = await prisma.review.findFirst({
      where: {
        review_id: id,
        reviewer_id: user_id,
      },
    });

    if (!review) {
      return handleError(
        next,
        "Review not found or you are not authorized to delete it",
        StatusCodes.NOT_FOUND,
      );
    }

    await prisma.review.delete({
      where: {
        review_id: id,
      },
    });

    res.status(StatusCodes.OK).json({ message: "Review deleted" });
  },
);

export const updateUserReview = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { review_id } = req.params;
    const id = Number(review_id);
    const { rating, review_text }: ReviewData = req.body;

    const review = await prisma.review.findFirst({
      where: {
        review_id: id,
        reviewer_id: user_id,
      },
    });

    if (!review) {
      return handleError(
        next,
        "Review not found or you are not authorized to edit it",
        StatusCodes.NOT_FOUND,
      );
    }

    const updatedReview = await prisma.review.update({
      where: {
        review_id: id,
      },
      data: {
        rating,
        review_text,
      },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Review updated", review: updatedReview });
  },
);
