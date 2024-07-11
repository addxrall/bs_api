import express, { NextFunction, Request, Response } from "express";
import {
  acceptSwapRequest,
  cancelSwapRequest,
  declineSwapRequest,
  deleteSwapRequest,
  newSwapRequest,
  showUserSwapRequests,
} from "../services/swapRequest";
import { createAsyncMiddleware } from "../middleware/createAsyncMiddleware";

const router = express.Router();

router.get("/show", createAsyncMiddleware(showUserSwapRequests));
router.post("/:book_id/new", createAsyncMiddleware(newSwapRequest));
router.post(
  "/:swap_request_id/delete",
  createAsyncMiddleware(deleteSwapRequest),
);
router.post(
  "/:swap_request_id/decline",
  createAsyncMiddleware(declineSwapRequest),
);
router.post(
  "/:swap_request_id/accept",
  createAsyncMiddleware(acceptSwapRequest),
);
router.post(
  "/:swap_request_id/cancel",
  createAsyncMiddleware(cancelSwapRequest),
);

export default router;
