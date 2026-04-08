import { config } from "dotenv";
config();

import express, { Express } from "express";
import cors from "cors";
import pool from "./config/db.config";
import colors from "colors";
import userRouter from "./routes/user.routes";
import listingRouter from "./routes/listing.routes";
import swapRouter from "./routes/swap.routes";
import chatRouter from "./routes/chat.routes";
import calculatorRoutes from "./routes/calculator.routes";

const app: Express = express();
const port: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/swaps", swapRouter);
app.use("/api/chat", chatRouter);
app.use("/api/calculator", calculatorRoutes);

pool
  .query("SELECT 1")
  .then(() => {
    console.log(colors.bgMagenta.black("Database connection successful"));
    app.listen(port, () => {
      console.log(colors.bgCyan.white(`Example app listening on port ${port}`));
    });
  })
  .catch((err) => {
    console.error(colors.bgRed.white("Database connection failed:"), err.message);
  });
