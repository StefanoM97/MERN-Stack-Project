import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

await connectDb();
app.listen(env.port, "127.0.0.1", () => {
  console.log(`ReuseHub API listening on port ${env.port}`);
});
