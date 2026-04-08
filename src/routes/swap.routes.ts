import express, { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {  sendSwapRequest, getIncomingSwaps, getOutgoingSwaps, acceptSwap, rejectSwap  } from "../controller/swap.controller";
const swapRouter: Router = express.Router();

swapRouter.post("/send", authMiddleware, sendSwapRequest as any);
swapRouter.get("/incoming", authMiddleware, getIncomingSwaps as any);
swapRouter.get("/outgoing", authMiddleware, getOutgoingSwaps as any);
swapRouter.put("/accept/:id", authMiddleware, acceptSwap as any);
swapRouter.put("/reject/:id", authMiddleware, rejectSwap as any);

export default swapRouter;
