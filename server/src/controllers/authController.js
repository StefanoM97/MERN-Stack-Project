import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import {
  registerSchema,
  loginSchema,
  emailSchema,
  tokenSchema,
  resetSchema,
  googleSchema
} from "../validators/authValidators.js";
import {
  createOpaqueToken,
  hashOpaqueToken,
  signAuthToken,
  authCookieOptions
} from "../utils/tokens.js";
import { extractSchoolDomain } from "../utils/normalize.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";
import { serializeOwnUser } from "../serializers/userSerializers.js";

const googleClient = new OAuth2Client(env.googleClientId);

function setSession(res, user) {
  const accessToken = signAuthToken(user._id.toString());
  res.cookie(env.cookieName, accessToken, authCookieOptions());
  return accessToken;
}

export async function register(req, res) {
  const input = registerSchema.parse(req.body);
  const email = input.email.toLowerCase();

  if (await User.exists({ email })) {
    return res.status(409).json({ error: "An account already exists for this email" });
  }

  const verification = createOpaqueToken();
  const user = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email,
    passwordHash: await bcrypt.hash(input.password, 12),
    schoolDomain: extractSchoolDomain(email),
    communityName: input.communityName,
    verificationTokenHash: verification.hash,
    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  const delivery = await sendVerificationEmail(user, verification.raw);
  return res.status(201).json({
    message: "Account created. Verify your email before logging in.",
    user: serializeOwnUser(user),
    developmentVerificationUrl:
      !env.isProduction && delivery.developmentPreview ? delivery.previewUrl : undefined,
    verificationToken: env.isTest ? verification.raw : undefined
  });
}

export async function verifyEmail(req, res) {
  const { token } = tokenSchema.parse(req.body);
  const user = await User.findOne({
    verificationTokenHash: hashOpaqueToken(token),
    verificationTokenExpiresAt: { $gt: new Date() }
  });
  if (!user) return res.status(400).json({ error: "Invalid or expired verification token" });

  user.emailVerified = true;
  user.verificationTokenHash = "";
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  const accessToken = setSession(res, user);
  return res.json({
    message: "Email verified",
    accessToken,
    user: serializeOwnUser(user)
  });
}

export async function login(req, res) {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email.toLowerCase() });

  if (!user?.passwordHash || !(await bcrypt.compare(input.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  if (!user.emailVerified) {
    return res.status(403).json({ error: "Verify your email before logging in" });
  }

  const accessToken = setSession(res, user);
  return res.json({ accessToken, user: serializeOwnUser(user) });
}

export async function googleLogin(req, res) {
  if (!env.googleClientId) {
    return res.status(503).json({ error: "Google authentication is not configured" });
  }

  const { credential } = googleSchema.parse(req.body);
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId
  });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    return res.status(401).json({ error: "Google account could not be verified" });
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
  });

  if (!user) {
    user = await User.create({
      firstName: payload.given_name || "Google",
      lastName: payload.family_name || "User",
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      emailVerified: true,
      schoolDomain: payload.hd || extractSchoolDomain(payload.email)
    });
  } else {
    user.googleId ||= payload.sub;
    user.emailVerified = true;
    user.schoolDomain ||= payload.hd || extractSchoolDomain(payload.email);
    await user.save();
  }

  const accessToken = setSession(res, user);
  return res.json({ accessToken, user: serializeOwnUser(user) });
}

export async function forgotPassword(req, res) {
  const { email } = emailSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() });
  let delivery;
  let reset;

  if (user) {
    reset = createOpaqueToken();
    user.resetTokenHash = reset.hash;
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    delivery = await sendPasswordResetEmail(user, reset.raw);
  }

  return res.json({
    message: "If the account exists, a reset link has been sent.",
    developmentResetUrl:
      !env.isProduction && delivery?.developmentPreview ? delivery.previewUrl : undefined,
    resetToken: env.isTest ? reset?.raw : undefined
  });
}

export async function resetPassword(req, res) {
  const input = resetSchema.parse(req.body);
  const user = await User.findOne({
    resetTokenHash: hashOpaqueToken(input.token),
    resetTokenExpiresAt: { $gt: new Date() }
  });
  if (!user) return res.status(400).json({ error: "Invalid or expired reset token" });

  user.passwordHash = await bcrypt.hash(input.password, 12);
  user.resetTokenHash = "";
  user.resetTokenExpiresAt = undefined;
  user.emailVerified = true;
  await user.save();

  const accessToken = setSession(res, user);
  return res.json({
    message: "Password reset",
    accessToken,
    user: serializeOwnUser(user)
  });
}

export function logout(_req, res) {
  res.clearCookie(env.cookieName, { path: "/" });
  return res.status(204).end();
}

export function currentUser(req, res) {
  return res.json({ user: serializeOwnUser(req.user) });
}
