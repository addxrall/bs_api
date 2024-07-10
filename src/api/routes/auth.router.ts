import express from "express";
import { login, logout, register } from "../services/auth";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    await register(req.body, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await login(req.body, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (_, res) => {
  await logout(res);
});

export default router;
