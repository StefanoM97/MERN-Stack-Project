import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createOpaqueToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = hashOpaqueToken(raw);
  return { raw, hash };
}

export function hashOpaqueToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function signAuthToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  };
}
