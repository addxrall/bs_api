import express from "express";
import dotenv from "dotenv";
import authRoute from "./api/routes/auth.router";
import userRoute from "./api/routes/user.router";
import bookRoute from "./api/routes/book.router";
import swapRoute from "./api/routes/swapRequest.router";
import cookieParser from "cookie-parser";
import { errorHandler } from "./api/middleware/errorHandler";
import { authenticate } from "./api/middleware/authenticate";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use(authenticate);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/swap", swapRoute);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API started at http://localhost:${port}`);
});
