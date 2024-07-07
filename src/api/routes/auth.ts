import express from "express";

const router = express.Router();

router.get("/", (req: any, res: any, next: any) => {
  res.send({ message: "auth test" });
});

export default router;
