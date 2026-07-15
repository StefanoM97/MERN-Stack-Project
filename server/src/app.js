import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { itemRouter } from "./routes/itemRoutes.js";
import { communityRouter } from "./routes/communityRoutes.js";
import { interestRouter } from "./routes/interestRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "250kb" }));
app.use(cookieParser());
if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.isTest ? 1000 : 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", environment: env.nodeEnv, time: new Date().toISOString() })
);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/items", itemRouter);
app.use("/api/community", communityRouter);
app.use("/api/interest", interestRouter);

app.use(notFound);
app.use(errorHandler);
