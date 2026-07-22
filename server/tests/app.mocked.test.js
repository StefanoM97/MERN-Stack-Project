import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

function createProbeRouter(name) {
  const router = express.Router();

  router.get("/probe", (_req, res) => {
    res.json({ router: name });
  });

  return router;
}

await jest.unstable_mockModule("../src/routes/authRoutes.js", () => ({
  authRouter: createProbeRouter("auth")
}));

await jest.unstable_mockModule("../src/routes/profileRoutes.js", () => ({
  profileRouter: createProbeRouter("profile")
}));

await jest.unstable_mockModule("../src/routes/itemRoutes.js", () => ({
  itemRouter: createProbeRouter("items")
}));

await jest.unstable_mockModule("../src/routes/communityRoutes.js", () => ({
  communityRouter: createProbeRouter("community")
}));

await jest.unstable_mockModule("../src/routes/interestRoutes.js", () => ({
  interestRouter: createProbeRouter("interest")
}));

const { app } = await import("../src/app.js");

describe("Express application behavior with mocked routers", () => {
  const allowedOrigin = "http://localhost:5173";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("mounts every API router at the expected path", async () => {
    const probes = [
      ["/api/auth/probe", "auth"],
      ["/api/profile/probe", "profile"],
      ["/api/items/probe", "items"],
      ["/api/community/probe", "community"],
      ["/api/interest/probe", "interest"]
    ];

    for (const [path, expectedRouter] of probes) {
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ router: expectedRouter });
    }
  });

  it("returns health metadata", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      environment: "test"
    });
    expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
  });

  it("adds Helmet security headers", async () => {
    const response = await request(app).get("/api/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBeTruthy();
  });

  it("allows configured CORS origins with credentials", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", allowedOrigin);

    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe(allowedOrigin);
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("supports CORS preflight requests", async () => {
    const response = await request(app)
      .options("/api/items/probe")
      .set("Origin", allowedOrigin)
      .set("Access-Control-Request-Method", "GET");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(allowedOrigin);
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("rejects unapproved CORS origins", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://example.invalid");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Origin is not allowed by CORS"
    });
  });

  it("returns a safe 400 response for malformed JSON", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(app)
      .post("/api/auth/probe")
      .set("Content-Type", "application/json")
      .send('{"broken":');

    expect(response.status).toBe(400);
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.length).toBeGreaterThan(0);
  });

  it("returns the standardized JSON response for unknown routes", async () => {
    const response = await request(app).get("/api/not-a-real-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Route not found: GET /api/not-a-real-route"
    });
  });
});
