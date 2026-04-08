import express, { Router } from "express";
import { createListing,getAllListings } from "../controller/listing.controller";
import authMiddleware from "../middleware/auth.middleware";

const listingRouter: Router = express.Router();

listingRouter.post("/create", authMiddleware, createListing);
listingRouter.get("/list",authMiddleware,getAllListings);

export default listingRouter;
