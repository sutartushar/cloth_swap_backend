import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import pool from "../config/db.config";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    );
    const userId: number = (decoded as { userId: number }).userId;

    const [rows] = (await pool.query(
      "SELECT id,name,email FROM users WHERE id = ?",
      [userId],
    )) as [any[], any];

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: `message: "Invalid token",: ${errorMessage}` });
  }
};


export default authMiddleware;