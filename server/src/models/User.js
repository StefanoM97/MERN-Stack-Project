import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    emailVisible: { type: Boolean, default: true },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    phoneVisible: { type: Boolean, default: false },
    preferredContact: { type: String, enum: ["email", "phone"], default: "email" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, default: "" },
    googleId: { type: String, unique: true, sparse: true },
    schoolDomain: { type: String, lowercase: true, trim: true, index: true, default: "" },
    communityName: { type: String, trim: true, maxlength: 100, default: "" },
    contact: { type: contactSchema, default: () => ({}) },
    emailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String, default: "" },
    verificationTokenExpiresAt: { type: Date },
    resetTokenHash: { type: String, default: "" },
    resetTokenExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
