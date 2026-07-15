import request from "supertest";
import { app } from "../src/app.js";

export const validPassword = "Prototype123";

export async function createVerifiedAgent({
  email = "student@ucf.edu",
  firstName = "Student",
  lastName = "User"
} = {}) {
  const agent = request.agent(app);
  const registration = await agent.post("/api/auth/register").send({
    firstName,
    lastName,
    email,
    password: validPassword,
    communityName: "UCF"
  });

  const token = registration.body.verificationToken;
  await agent.post("/api/auth/verify-email").send({ token });
  return { agent, registration };
}
