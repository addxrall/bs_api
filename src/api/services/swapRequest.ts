import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { getUserIdFromToken } from "../utils/verifyToken";
import { PrismaClient } from "@prisma/client";
import { SWAP_STATUS } from "../interfaces";
import { handleError } from "../utils/handleError";
import { handleAsync } from "../utils";

const prisma = new PrismaClient();

const getBookById = async (book_id: number) => {
  return await prisma.book.findUnique({ where: { book_id } });
};

const getSwapRequestById = async (swap_request_id: number) => {
  return await prisma.swapRequest.findUnique({ where: { swap_request_id } });
};

const getSwapRequest = async (requester_id: number, book_id: number) => {
  return await prisma.swapRequest.findFirst({
    where: { requester_id, book_id },
  });
};

export const newSwapRequest = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { book_id } = req.params;
    const id = Number(book_id);

    if (!id)
      return handleError(next, "Specify book id", StatusCodes.BAD_REQUEST);

    const book = await getBookById(id);
    if (!book) return handleError(next, "No book found", StatusCodes.NOT_FOUND);
    if (book.user_id === user_id)
      return handleError(
        next,
        "Cannot request swap for user book",
        StatusCodes.BAD_REQUEST,
      );

    const swapExists = await getSwapRequest(user_id, id);
    if (swapExists)
      return handleError(
        next,
        "This request already exists",
        StatusCodes.BAD_REQUEST,
      );

    await prisma.swapRequest.create({
      data: { requester_id: user_id, book_id: id, status: SWAP_STATUS.pending },
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "New Swap Request was created" });
  },
);

export const deleteSwapRequest = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { swap_request_id } = req.params;
    const id = Number(swap_request_id);

    const swapExists = await prisma.swapRequest.findFirst({
      where: {
        swap_request_id: id,
        requester_id: user_id,
      },
    });

    if (!swapExists)
      return handleError(
        next,
        "This request doesn't exist or doesn't belong to this user",
        StatusCodes.BAD_REQUEST,
      );

    await prisma.swapRequest.delete({
      where: { swap_request_id: id },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Swap request deleted successfully" });
  },
);

export const showUserSwapRequests = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);

    const swapRequests = await prisma.swapRequest.findMany({
      where: {
        requester_id: user_id,
      },
    });

    res.status(StatusCodes.OK).json({ swapRequests });
  },
);

export const declineSwapRequest = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { swap_request_id } = req.params;
    const request_id = Number(swap_request_id);

    if (!request_id)
      return handleError(next, "No request id found", StatusCodes.NOT_FOUND);

    const swapRequest = await getSwapRequestById(request_id);
    if (!swapRequest)
      return handleError(
        next,
        "This swap request doesn't exist",
        StatusCodes.NOT_FOUND,
      );

    await prisma.swapRequest.update({
      where: { swap_request_id: request_id },
      data: { status: SWAP_STATUS.declined },
    });

    res.status(StatusCodes.OK).json({ message: "Swap request declined" });
  },
);

export const acceptSwapRequest = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { swap_request_id } = req.params;
    const request_id = Number(swap_request_id);

    if (!request_id)
      return handleError(next, "No request id found", StatusCodes.NOT_FOUND);

    const swapRequest = await getSwapRequestById(request_id);
    if (!swapRequest)
      return handleError(
        next,
        "This swap request doesn't exist",
        StatusCodes.NOT_FOUND,
      );
    if (swapRequest.requester_id === user_id)
      return handleError(
        next,
        "This request belongs to this user",
        StatusCodes.BAD_REQUEST,
      );

    await prisma.swapRequest.update({
      where: { swap_request_id: request_id },
      data: { status: SWAP_STATUS.accepted },
    });

    res.status(StatusCodes.OK).json({ message: "Swap request accepted" });
  },
);

export const cancelSwapRequest = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const user_id = getUserIdFromToken(token);
    const { swap_request_id } = req.params;
    const request_id = Number(swap_request_id);

    if (!request_id)
      return handleError(next, "No request id found", StatusCodes.NOT_FOUND);

    const swapRequest = await getSwapRequestById(request_id);
    if (!swapRequest)
      return handleError(
        next,
        "This swap request doesn't exist",
        StatusCodes.NOT_FOUND,
      );
    if (swapRequest.requester_id !== user_id)
      return handleError(
        next,
        "This request wasn't created by this user",
        StatusCodes.BAD_REQUEST,
      );

    await prisma.swapRequest.update({
      where: { swap_request_id: request_id },
      data: { status: SWAP_STATUS.cancelled },
    });

    res.status(StatusCodes.OK).json({ message: "Swap request cancelled" });
  },
);
