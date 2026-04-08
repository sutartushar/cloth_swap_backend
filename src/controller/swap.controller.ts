import { Response } from "express";
import pool from "../config/db.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AuthenticatedRequest } from "../types.js";

interface ListingRow extends RowDataPacket {
  id: number;
  user_id: number;
  status: string;
}

interface SwapRow extends RowDataPacket {
  id: number;
  requester_id: number;
  receiver_id: number;
  requester_listing_id: number;
  receiver_listing_id: number;
  message: string | null;
  status: string;
  created_at: Date;
}

const sendSwapRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { requester_listing_id, receiver_listing_id, message } = req.body;

    if (!requester_listing_id || !receiver_listing_id) {
      res.status(400).json({
        message: "requester_listing_id and receiver_listing_id are required",
      });
      return;
    }

    // check requester listing exists and belongs to logged in user
    const [requesterRows] = await pool.query<ListingRow[]>(
      `SELECT * FROM listings WHERE id = ? AND user_id = ?`,
      [requester_listing_id, req.user.id],
    );

    if (requesterRows.length === 0) {
      res.status(404).json({ message: "Your listing not found" });
      return;
    }

    const requesterListing = requesterRows[0];

    // check receiver listing exists
    const [receiverRows] = await pool.query<ListingRow[]>(
      `SELECT * FROM listings WHERE id = ?`,
      [receiver_listing_id],
    );

    // ← combine both checks into one
    if (receiverRows.length === 0 || !receiverRows[0]) {
      res.status(404).json({ message: "Target listing not found" });
      return;
    }

    const receiverListing = receiverRows[0];
    if (receiverListing.status !== "available") {
      res
        .status(400)
        .json({ message: "This listing is not available for swapping" });
      return;
    }

    // prevent self swap
    if (receiverListing.user_id === req.user.id) {
      res
        .status(400)
        .json({ message: "You cannot swap with your own listing" });
      return;
    }

    // prevent duplicate pending request
    const [existingRows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM swaps 
       WHERE requester_listing_id = ? 
       AND receiver_listing_id = ? 
       AND status = 'pending'`,
      [requester_listing_id, receiver_listing_id],
    );

    if (existingRows.length > 0) {
      res
        .status(409)
        .json({ message: "A pending swap request already exists" });
      return;
    }

    // insert swap
    const [swapResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO swaps 
       (requester_id, receiver_id, requester_listing_id, receiver_listing_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        receiverListing.user_id,
        requester_listing_id,
        receiver_listing_id,
        message?.trim() || null,
      ],
    );

    const [swapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapResult.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Swap request sent successfully",
      data: swapRows[0],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const getIncomingSwaps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [swaps] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE receiver_id = ? ORDER BY created_at DESC`,
      [req.user.id],
    );

    res.status(200).json({
      success: true,
      data: swaps,
      total: swaps.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const getOutgoingSwaps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [swaps] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE requester_id = ? ORDER BY created_at DESC`,
      [req.user.id],
    );

    res.status(200).json({
      success: true,
      data: swaps,
      total: swaps.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const acceptSwap  = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: "Invalid Swap ID" });
      return;
    }
    const swapId = parseInt(id, 10);

    // Find the swap request
    const [swapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    const swap = swapRows[0];
    if (!swap) {
      res.status(404).json({ message: "Swap request not found" });
      return;
    }

    // Check if the current user is the receiver
    if (swap.receiver_id !== req.user.id) {
      res.status(403).json({
        message: "Only the receiver can accept a swap request",
      });
      return;
    }

    // Ensure it's still pending
    if (swap.status !== "pending") {
      res.status(400).json({
        message: `Swap request is already ${swap.status}`,
      });
      return;
    }

    // Update swap status to accepted
    await pool.query<ResultSetHeader>(
      `UPDATE swaps SET status = 'accepted' WHERE id = ?`,
      [swapId]
    );

    // Mark both listings as pending so they can't be swapped again
    await pool.query<ResultSetHeader>(
      `UPDATE listings SET status = 'pending' WHERE id IN (?, ?)`,
      [swap.requester_listing_id, swap.receiver_listing_id]
    );

    // Fetch the updated swap request
    const [updatedSwapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    res.status(200).json({
      success: true,
      message: "Swap request accepted",
      data: updatedSwapRows[0],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const rejectSwap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: "Invalid Swap ID" });
      return;
    }
    const swapId = parseInt(id, 10);

    // Find the swap request
    const [swapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    const swap = swapRows[0];
    if (!swap) {
      res.status(404).json({ message: "Swap request not found" });
      return;
    }

    // Check if the current user is the receiver
    if (swap.receiver_id !== req.user.id) {
      res.status(403).json({
        message: "Only the receiver can reject a swap request",
      });
      return;
    }

    // Ensure it's still pending
    if (swap.status !== "pending") {
      res.status(400).json({
        message: `Swap request is already ${swap.status}`,
      });
      return;
    }

    // Update swap status to rejected
    await pool.query<ResultSetHeader>(
      `UPDATE swaps SET status = 'rejected' WHERE id = ?`,
      [swapId]
    );

    // Mark both listings back to available
    await pool.query<ResultSetHeader>(
      `UPDATE listings SET status = 'available' WHERE id IN (?, ?)`,
      [swap.requester_listing_id, swap.receiver_listing_id]
    );

    // Fetch the updated swap request
    const [updatedSwapRows] = await pool.query<SwapRow[]>(
      `SELECT * FROM swaps WHERE id = ?`,
      [swapId]
    );

    res.status(200).json({
      success: true,
      message: "Swap request rejected",
      data: updatedSwapRows[0],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};


export { sendSwapRequest, getIncomingSwaps, getOutgoingSwaps, acceptSwap, rejectSwap };
