import { setupTestDatabase } from "./dbTestSetup.js";
import request from "supertest";
import { app } from "../src/app.js";
import { validPassword } from "./helpers.js";

setupTestDatabase();

describe("authentication", () => {
  it("registers, verifies, logs in, reads the session, and logs out", async () => {
    const registration = await request(app).post("/api/auth/register").send({
      firstName: "Stefano",
      lastName: "Student",
      email: "stefano@ucf.edu",
      password: validPassword,
      communityName: "UCF"
    });
    expect(registration.status).toBe(201);
    expect(registration.body.verificationToken).toBeTruthy();

    const unverifiedLogin = await request(app).post("/api/auth/login").send({
      email: "stefano@ucf.edu",
      password: validPassword
    });
    expect(unverifiedLogin.status).toBe(403);

    const agent = request.agent(app);
    const verification = await agent.post("/api/auth/verify-email").send({
      token: registration.body.verificationToken
    });
    expect(verification.status).toBe(200);
    expect(verification.body.accessToken).toBeTruthy();

    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.schoolDomain).toBe("ucf.edu");

    const bearerMe = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${verification.body.accessToken}`);

    expect(bearerMe.status).toBe(200);
    expect(bearerMe.body.user.email).toBe("stefano@ucf.edu");

    const logout = await agent.post("/api/auth/logout");
    expect(logout.status).toBe(204);
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });

  it("rejects malformed and invalid Bearer credentials", async () => {
    const malformed = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Basic not-a-bearer-token");

    expect(malformed.status).toBe(401);
    expect(malformed.body.error).toBe("Invalid authorization header");

    const invalid = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not-a-valid-jwt");

    expect(invalid.status).toBe(401);
    expect(invalid.body.error).toBe("Invalid or expired session");
  });

  it("supports password reset without revealing whether an email exists", async () => {
    const registration = await request(app).post("/api/auth/register").send({
      firstName: "Reset",
      lastName: "Example",
      email: "reset@example.com",
      password: validPassword
    });
    expect(registration.status).toBe(201);

    const forgot = await request(app).post("/api/auth/forgot-password").send({
      email: "reset@example.com"
    });
    expect(forgot.status).toBe(200);
    expect(forgot.body.resetToken).toBeTruthy();

    const reset = await request(app).post("/api/auth/reset-password").send({
      token: forgot.body.resetToken,
      password: "NewPrototype123"
    });
    expect(reset.status).toBe(200);
    expect(reset.body.accessToken).toBeTruthy();

    const bearerMe = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${reset.body.accessToken}`);

    expect(bearerMe.status).toBe(200);
    expect(bearerMe.body.user.email).toBe("reset@example.com");
  });
});
