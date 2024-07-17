import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
} from "../services/book";
import { createAsyncMiddleware } from "../middleware/createAsyncMiddleware";

const router = express.Router();

router.get("/all", createAsyncMiddleware(getAllBooks));
router.get("/:id/show", createAsyncMiddleware(getBookById));
router.post("/new", createAsyncMiddleware(addBook));
router.delete("/:book_id/delete", createAsyncMiddleware(deleteBook));

export default router;
