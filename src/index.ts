import express from "express";
import dotenv from "dotenv";
import { auth } from "./api/services/auth";
import authRoute from "./api/routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(auth);

app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`API started at http://localhost:${port}`);
});
