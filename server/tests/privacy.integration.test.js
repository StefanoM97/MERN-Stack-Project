import { setupTestDatabase } from "./dbTestSetup.js";
import { createVerifiedAgent } from "./helpers.js";

setupTestDatabase();

describe("contact privacy", () => {
  it("removes hidden contact values from community API responses", async () => {
    const owner = await createVerifiedAgent({ email: "private@ucf.edu" });
    const viewer = await createVerifiedAgent({ email: "viewer@ucf.edu" });

    await owner.agent.put("/api/profile").send({
      firstName: "Private",
      lastName: "Owner",
      communityName: "UCF",
      contact: {
        emailVisible: false,
        phone: "407-555-0100",
        phoneVisible: false,
        preferredContact: "email"
      }
    });

    await owner.agent.post("/api/items").send({
      title: "Public Textbook",
      description: "Reusable book",
      category: "Books",
      condition: "Good",
      status: "Available to give away",
      visibility: "Public",
      keywords: ["textbook"]
    });

    const results = await viewer.agent.get("/api/community/items?search=textbook");
    expect(results.status).toBe(200);
    expect(results.body.items).toHaveLength(1);
    expect(results.body.items[0].owner.email).toBeUndefined();
    expect(results.body.items[0].owner.phone).toBeUndefined();
  });
});
