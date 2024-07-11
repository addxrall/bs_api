import express from "express";
import { addBook, deleteBook } from "../services/book";
import { createAsyncMiddleware } from "../middleware/createAsyncMiddleware";

const router = express.Router();

router.post("/new", createAsyncMiddleware(addBook));
router.delete("/:book_id/delete", createAsyncMiddleware(deleteBook));

export default router;
