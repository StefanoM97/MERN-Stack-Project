import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { verifyAuthToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function extractAuthToken(req) {
  const authorization = req.get("authorization");

  if (authorization) {
    const match = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return { error: "Invalid authorization header" };
    }

    return {
      token: match[1],
      transport: "bearer"
    };
  }

  const cookieToken = req.cookies?.[env.cookieName];

  return {
    token: cookieToken,
    transport: cookieToken ? "cookie" : undefined
  };
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authentication = extractAuthToken(req);

  if (authentication.error) {
    return res.status(401).json({ error: authentication.error });
  }

  if (!authentication.token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  let payload;
  try {
    payload = verifyAuthToken(authentication.token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ error: "User no longer exists" });

  req.user = user;
  req.authTransport = authentication.transport;
  next();
});
