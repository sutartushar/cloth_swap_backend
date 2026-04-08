import express from "express";
import { estimateClothingValue } from "../controller/calculator.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, estimateClothingValue as any);

export default router;
