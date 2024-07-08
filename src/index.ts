import express from "express";
import dotenv from "dotenv";
import authRoute from "./api/routes/auth.router";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`API started at http://localhost:${port}`);
});
