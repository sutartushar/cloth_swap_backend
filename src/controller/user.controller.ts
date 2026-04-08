import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import pool from "../config/db.config.js";

//generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "3d" });
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, password, phone_number, location } = req.body;

    //validate input
    if (!name || !email || !password || !phone_number || !location) {
      res.status(400).json({ message: "All fields are required" });
    }

    // Trim all string inputs early
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    phone_number = phone_number?.trim();
    location = location?.trim();

    // 1. Check if email already exists
    const [existingUser] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // 2. Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const [result] = await pool.query<any>(
      `INSERT INTO users (name, email, password, phone_number, location) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone_number, location],
    );

    const token: string = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password } = req.body;

    //validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Trim inputs
    email.trim().toLowerCase();
    password.trim();

    const [user] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",[email]
    );

    if (user.length === 0) {
      res.status(400).json({ message: "User not found" });
      return;
    };

    const foundUser:RowDataPacket | undefined = user[0] as RowDataPacket;

    const isPasswordValid:boolean = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token:string = generateToken(foundUser.id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });

  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
};

export { registerUser , loginUser};
