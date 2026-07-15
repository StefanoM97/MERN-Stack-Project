import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export function setupTestDatabase() {
  let mongoServer;

  beforeAll(async () => {
    if (process.env.TEST_MONGODB_URI) {
      await mongoose.connect(process.env.TEST_MONGODB_URI);
      return;
    }

    mongoServer = await MongoMemoryServer.create({
      binary: process.env.MONGOMS_VERSION
        ? { version: process.env.MONGOMS_VERSION }
        : undefined
    });
    await mongoose.connect(mongoServer.getUri());
  }, 120000);

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });
}
