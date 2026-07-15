import { setupTestDatabase } from "./dbTestSetup.js";
import { createVerifiedAgent } from "./helpers.js";

setupTestDatabase();

describe("interest endpoint", () => {
  it("creates an internal-only snapshot when external APIs are unconfigured", async () => {
    const owner = await createVerifiedAgent({ email: "interest@ucf.edu" });
    const item = await owner.agent.post("/api/items").send({
      title: "Mechanical Keyboard",
      description: "Keyboard in good condition",
      category: "Electronics",
      condition: "Good",
      status: "Available to sell",
      visibility: "Public",
      keywords: ["keyboard"]
    });

    const response = await owner.agent
      .post(`/api/interest/items/${item.body.item.id}/check`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.snapshot.reuseScore).toBeGreaterThanOrEqual(0);
    expect(response.body.services.ebay.available).toBe(false);
    expect(response.body.services.youtube.available).toBe(false);
  });
});
