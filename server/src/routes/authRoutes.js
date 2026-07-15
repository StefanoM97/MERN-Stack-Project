import express from "express";
import {
  register,
  verifyEmail,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  logout,
  currentUser
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = express.Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/verify-email", asyncHandler(verifyEmail));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/google", asyncHandler(googleLogin));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password", asyncHandler(resetPassword));
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, currentUser);
