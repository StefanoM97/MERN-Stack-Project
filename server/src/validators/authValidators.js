import { z } from "zod";

const strongPassword = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().email().max(254),
  password: strongPassword,
  communityName: z.string().trim().max(100).optional().default("")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const emailSchema = z.object({ email: z.string().email() });
export const tokenSchema = z.object({ token: z.string().min(20) });
export const resetSchema = z.object({ token: z.string().min(20), password: strongPassword });
export const googleSchema = z.object({ credential: z.string().min(20) });
