import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const profileRouter = express.Router();
profileRouter.use(requireAuth);
profileRouter.get("/", getProfile);
profileRouter.put("/", asyncHandler(updateProfile));
