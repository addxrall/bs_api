import express, { NextFunction, Request, Response } from "express";
import {
  acceptSwapRequest,
  cancelSwapRequest,
  declineSwapRequest,
  deleteSwapRequest,
  newSwapRequest,
  showUserSwapRequests,
} from "../services/swapRequest";

const router = express.Router();

const handleSwapRequest = (
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

router.get("/show", handleSwapRequest(showUserSwapRequests));
router.post("/:book_id/new", handleSwapRequest(newSwapRequest));
router.post("/:swap_request_id/delete", handleSwapRequest(deleteSwapRequest));
router.post("/:swap_request_id/decline", handleSwapRequest(declineSwapRequest));
router.post("/:swap_request_id/accept", handleSwapRequest(acceptSwapRequest));
router.post("/:swap_request_id/cancel", handleSwapRequest(cancelSwapRequest));

export default router;
