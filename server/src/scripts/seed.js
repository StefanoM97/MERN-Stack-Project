import bcrypt from "bcryptjs";
import { connectDb, disconnectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";

await connectDb();

const passwordHash = await bcrypt.hash("Prototype123", 12);
const demoUser = await User.findOneAndUpdate(
  { email: "demo@ucf.edu" },
  {
    firstName: "Demo",
    lastName: "User",
    email: "demo@ucf.edu",
    passwordHash,
    schoolDomain: "ucf.edu",
    communityName: "UCF",
    emailVerified: true,
    contact: { emailVisible: true, phoneVisible: false, preferredContact: "email" }
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

await Item.deleteMany({ ownerId: demoUser._id });
await Item.insertMany([
  {
    ownerId: demoUser._id,
    ownerSchoolDomain: demoUser.schoolDomain,
    title: "TI-84 Plus Calculator",
    description: "Working graphing calculator available to lend.",
    category: "School Supplies",
    condition: "Good",
    status: "Available to lend",
    visibility: "School",
    keywords: ["calculator", "ti-84", "school"]
  },
  {
    ownerId: demoUser._id,
    ownerSchoolDomain: demoUser.schoolDomain,
    title: "Cordless Drill",
    description: "Household drill with charger.",
    category: "Tools",
    condition: "Good",
    status: "Available to lend",
    visibility: "Public",
    keywords: ["drill", "tools"]
  }
]);

console.log("Seed complete. Login: demo@ucf.edu / Prototype123");
await disconnectDb();
