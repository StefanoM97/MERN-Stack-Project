import mongoose from "mongoose";

export const ITEM_CATEGORIES = [
  "Books",
  "Apparel",
  "Tools",
  "Electronics",
  "Furniture",
  "School Supplies",
  "Household Items",
  "Sports / Outdoor",
  "Non-perishable Goods",
  "Other"
];

export const ITEM_CONDITIONS = ["New", "Like New", "Good", "Fair", "Needs Repair"];
export const ITEM_STATUSES = [
  "Keeping",
  "Available to lend",
  "Available to give away",
  "Available to sell",
  "Available to donate",
  "Needs repair",
  "Recycled / removed"
];
export const ITEM_VISIBILITIES = ["Private", "School", "Public"];

const estimatedValueSchema = new mongoose.Schema(
  {
    low: { type: Number, min: 0 },
    high: { type: Number, min: 0 },
    average: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    checkedAt: { type: Date }
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerSchoolDomain: { type: String, lowercase: true, trim: true, index: true, default: "" },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1200, default: "" },
    category: { type: String, enum: ITEM_CATEGORIES, required: true, index: true },
    condition: { type: String, enum: ITEM_CONDITIONS, required: true, index: true },
    status: { type: String, enum: ITEM_STATUSES, required: true, index: true },
    quantity: { type: Number, min: 1, max: 999, default: 1 },
    locationLabel: { type: String, trim: true, maxlength: 100, default: "" },
    visibility: { type: String, enum: ITEM_VISIBILITIES, default: "Private", index: true },
    keywords: [{ type: String, lowercase: true, trim: true, maxlength: 40 }],
    imageUrl: { type: String, trim: true, maxlength: 1000, default: "" },
    estimatedValue: { type: estimatedValueSchema }
  },
  { timestamps: true }
);

itemSchema.index({ ownerId: 1, createdAt: -1 });
itemSchema.index({ visibility: 1, ownerSchoolDomain: 1, category: 1, status: 1 });
itemSchema.index({ title: "text", description: "text", keywords: "text" });

export const Item = mongoose.model("Item", itemSchema);
