import request from "supertest";
import { app } from "../src/app.js";

describe("GET /api/health", () => {
  it("returns an OK response", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
