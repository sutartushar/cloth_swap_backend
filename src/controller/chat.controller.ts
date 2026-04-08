import { Response } from "express";
import pool from "../config/db.config";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AuthenticatedRequest, MessageRow, SwapRow } from "../types";

// helper — check if the logged in user is part of this swap
const isSwapParticipant = (swap: SwapRow, userId: number): boolean => {
  return swap.requester_id === userId || swap.receiver_id === userId;
};

// POST /api/chat/:swapId
export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { swapId } = req.params;
    const { content } = req.body;

    // validate content
    if (!content || content.trim().length === 0) {
      res.status(400).json({ message: "Message content is required" });
      return;
    }

    // check swap exists
    const [swapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    if (swapRows.length === 0 || !swapRows[0]) {
      res.status(404).json({ message: "Swap not found" });
      return;
    }

    const swap = swapRows[0];

    // only participants of this swap can send messages
    if (!isSwapParticipant(swap, req.user.id)) {
      res.status(403).json({
        message: "You are not a participant of this swap",
      });
      return;
    }

    // only allow chat on active swaps
    if (swap.status === "rejected" || swap.status === "cancelled") {
      res.status(400).json({
        message: `Cannot send messages on a ${swap.status} swap`,
      });
      return;
    }

    // insert message
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO messages (swap_id, sender_id, content) VALUES (?, ?, ?)`,
      [swapId, req.user.id, content.trim()]
    );

    // return inserted message with sender details
    const [messageRows] = await pool.query<MessageRow[]>(
      `SELECT m.*, u.name as sender_name, u.email as sender_email
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: messageRows[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

// GET /api/chat/:swapId
export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { swapId } = req.params;

    // check swap exists
    const [swapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    if (swapRows.length === 0 || !swapRows[0]) {
      res.status(404).json({ message: "Swap not found" });
      return;
    }

    const swap = swapRows[0];

    // only participants can read messages
    if (!isSwapParticipant(swap, req.user.id)) {
      res.status(403).json({
        message: "You are not a participant of this swap",
      });
      return;
    }

    // fetch all messages for this swap
    const [messages] = await pool.query<MessageRow[]>(
      `SELECT m.*, u.name as sender_name, u.email as sender_email
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.swap_id = ?
       ORDER BY m.created_at ASC`,
      [swapId]
    );

    // mark all unread messages as read
    // (only marks messages sent by the OTHER person)
    await pool.query(
      `UPDATE messages 
       SET is_read = 1 
       WHERE swap_id = ? AND sender_id != ? AND is_read = 0`,
      [swapId, req.user.id]
    );

    res.status(200).json({
      success: true,
      data: messages,
      total: messages.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

// GET /api/chat/unread
export const getUnreadCount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // get unread message count per swap for the logged in user
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT m.swap_id, COUNT(*) as unread_count
       FROM messages m
       LEFT JOIN swaps s ON m.swap_id = s.id
       WHERE (s.requester_id = ? OR s.receiver_id = ?)
       AND m.sender_id != ?
       AND m.is_read = 0
       GROUP BY m.swap_id`,
      [req.user.id, req.user.id, req.user.id]
    );

    res.status(200).json({
      success: true,
      data: rows,
      total_unread: rows.reduce((sum, row) => sum + row.unread_count, 0),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};
