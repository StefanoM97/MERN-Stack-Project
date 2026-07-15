import express from "express";
import { searchCommunity } from "../controllers/communityController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const communityRouter = express.Router();
communityRouter.use(requireAuth);
communityRouter.get("/items", asyncHandler(searchCommunity));
