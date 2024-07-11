import express from "express";
import { addBook, deleteBook } from "../services/book";
import { createAsyncMiddleware } from "../middleware/createAsyncMiddleware";

const router = express.Router();

router.post("/add", createAsyncMiddleware(addBook));
router.delete("/:id/delete", createAsyncMiddleware(deleteBook));

export default router;
