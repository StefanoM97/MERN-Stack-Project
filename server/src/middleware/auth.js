import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { verifyAuthToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) return res.status(401).json({ error: "Authentication required" });

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ error: "User no longer exists" });

  req.user = user;
  next();
});
