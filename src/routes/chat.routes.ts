import express from "express";
import { sendMessage, getMessages, getUnreadCount } from "../controller/chat.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/:swapId", authMiddleware,sendMessage as any);
router.get("/unread", authMiddleware,getUnreadCount as any);
router.get("/:swapId", authMiddleware,getMessages as any);

export default router;
