import express, { Router } from "express";
import {registerUser,loginUser} from "../controller/user.controller";

const userRouter:Router = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
