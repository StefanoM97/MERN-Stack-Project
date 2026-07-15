import mongoose from "mongoose";

const searchMetricSchema = new mongoose.Schema(
  {
    normalizedKeyword: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    schoolDomain: { type: String, lowercase: true, trim: true, default: "", index: true }
  },
  { timestamps: true }
);

searchMetricSchema.index({ normalizedKeyword: 1, createdAt: -1 });

export const SearchMetric = mongoose.model("SearchMetric", searchMetricSchema);
