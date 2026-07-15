import { setupTestDatabase } from "./dbTestSetup.js";
import { createVerifiedAgent } from "./helpers.js";

const baseItem = {
  title: "TI-84 Plus Calculator",
  description: "Working calculator",
  category: "School Supplies",
  condition: "Good",
  status: "Available to lend",
  quantity: 1,
  locationLabel: "Campus",
  visibility: "School",
  keywords: ["calculator", "ti-84"],
  imageUrl: ""
};

setupTestDatabase();

describe("inventory and community visibility", () => {
  it("supports CRUD for an owner and blocks another user from editing", async () => {
    const owner = await createVerifiedAgent({ email: "owner@ucf.edu" });
    const other = await createVerifiedAgent({ email: "other@ucf.edu" });

    const created = await owner.agent.post("/api/items").send(baseItem);
    expect(created.status).toBe(201);
    const itemId = created.body.item.id;

    const updated = await owner.agent.put(`/api/items/${itemId}`).send({
      ...baseItem,
      status: "Available to donate"
    });
    expect(updated.status).toBe(200);
    expect(updated.body.item.status).toBe("Available to donate");

    const forbiddenEdit = await other.agent.put(`/api/items/${itemId}`).send(baseItem);
    expect(forbiddenEdit.status).toBe(404);

    expect((await owner.agent.delete(`/api/items/${itemId}`)).status).toBe(204);
  });

  it("enforces private, school, and public visibility", async () => {
    const owner = await createVerifiedAgent({ email: "owner@ucf.edu" });
    const sameSchool = await createVerifiedAgent({ email: "viewer@ucf.edu" });
    const otherSchool = await createVerifiedAgent({ email: "viewer@fiu.edu" });

    const schoolItem = await owner.agent.post("/api/items").send(baseItem);
    const privateItem = await owner.agent.post("/api/items").send({
      ...baseItem,
      title: "Private Item",
      visibility: "Private"
    });
    const publicItem = await owner.agent.post("/api/items").send({
      ...baseItem,
      title: "Public Drill",
      category: "Tools",
      visibility: "Public"
    });

    expect((await sameSchool.agent.get(`/api/items/${schoolItem.body.item.id}`)).status).toBe(200);
    expect((await otherSchool.agent.get(`/api/items/${schoolItem.body.item.id}`)).status).toBe(403);
    expect((await sameSchool.agent.get(`/api/items/${privateItem.body.item.id}`)).status).toBe(403);
    expect((await otherSchool.agent.get(`/api/items/${publicItem.body.item.id}`)).status).toBe(200);
  });
});
