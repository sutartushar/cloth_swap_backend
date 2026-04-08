import express from "express";
import { estimateClothingValue } from "../controller/calculator.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, estimateClothingValue as any);

export default router;
