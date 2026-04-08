import { Request } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export interface UserPayload {
  id: number;
  email?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export interface MessageRow extends RowDataPacket {
  id: number;
  swap_id: number;
  sender_id: number;
  content: string;
  is_read: number;
  created_at: Date;
  sender_name: string;
  sender_email: string;
}

export interface SwapRow extends RowDataPacket {
  id: number;
  requester_id: number;
  receiver_id: number;
  status: string;
}