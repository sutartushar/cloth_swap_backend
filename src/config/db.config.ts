import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const caPemPath = path.join(__dirname, "../../ca.pem");

const poolConfig: any = {
  host: process.env.HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "default",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(caPemPath),
    rejectUnauthorized: true,
  },
};

const pool = mysql.createPool(poolConfig);

export default pool;
