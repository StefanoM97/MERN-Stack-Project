import express from "express";
import { checkInterest, interestHistory } from "../controllers/interestController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const interestRouter = express.Router();
interestRouter.use(requireAuth);
interestRouter.post("/items/:id/check", asyncHandler(checkInterest));
interestRouter.get("/items/:id/history", asyncHandler(interestHistory));
