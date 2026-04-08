import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2/promise";
import pool from "../config/db.config.js";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const VALID_TYPES: string[] = [
  "tops",
  "bottoms",
  "dresses",
  "outerwear",
  "shoes",
  "accessories",
  "activewear",
  "formal",
];
const VALID_CONDITIONS: string[] = [
  "new_with_tags",
  "like_new",
  "good",
  "fair",
  "worn",
];
const VALID_SIZES: string[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const createListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const {
      title,
      description,
      clothing_type,
      brand,
      size,
      condition_status,
      estimated_value,
      location,
      latitude,
      longitude,
    } = req.body;

    if (!title || !clothing_type || !size || !condition_status) {
      res.status(400).json({
        message: "title, clothing_type, size and condition_status are required",
      });
      return;
    }

    if (!VALID_TYPES.includes(clothing_type)) {
      res.status(400).json({
        message: `clothing_type must be one of: ${VALID_TYPES.join(", ")}`,
      });
      return;
    }

    if (!VALID_CONDITIONS.includes(condition_status)) {
      res.status(400).json({
        message: `condition_status must be one of: ${VALID_CONDITIONS.join(", ")}`,
      });
      return;
    }

    const [result] = (await pool.query(
      "INSERT INTO listings (user_id, title, description, clothing_type, brand, size, condition_status, estimated_value, location, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.id,
        title,
        description || null,
        clothing_type,
        brand || null,
        size,
        condition_status,
        estimated_value || null,
        location || null,
        latitude || null,
        longitude || null,
      ],
    )) as [ResultSetHeader, any];

    const listing = result.insertId;

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const getAllListings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      clothing_type,
      size,
      condition_status,
      location,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    let query = "SELECT * FROM listings WHERE 1=1";
    const params: any[] = [];

    if (clothing_type) {
      query += " AND clothing_type = ?";
      params.push(clothing_type);
    }

    if (size) {
      query += " AND size = ?";
      params.push(size);
    }

    if (condition_status) {
      query += " AND condition_status = ?";
      params.push(condition_status);
    }

    if (location) {
      query += " AND location = ?";
      params.push(location);
    }

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 10),
    );
    const offset = (pageNum - 1) * limitNum;

    query += " LIMIT ? OFFSET ?";
    params.push(limitNum, offset);

    const [listings] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: (listings as any[]).length,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

export { createListing, getAllListings };
