import mongoose from "mongoose";

const marketplaceResultSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    currency: String,
    condition: String,
    imageUrl: String,
    itemUrl: String
  },
  { _id: false }
);

const videoResultSchema = new mongoose.Schema(
  {
    title: String,
    channelTitle: String,
    publishedAt: Date,
    viewCount: Number,
    videoUrl: String
  },
  { _id: false }
);

const interestSnapshotSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    keyword: { type: String, required: true, lowercase: true, trim: true, index: true },
    ebay: {
      totalListings: Number,
      sampleSize: Number,
      averagePrice: Number,
      lowPrice: Number,
      highPrice: Number,
      currency: String,
      results: [marketplaceResultSchema]
    },
    youtube: {
      resultCount: Number,
      sampledVideoCount: Number,
      totalViews: Number,
      videos: [videoResultSchema]
    },
    internal: {
      matchingItemCount: Number,
      matchingPublicCount: Number,
      matchingSchoolCount: Number,
      searchCount: Number
    },
    reuseScore: { type: Number, min: 0, max: 100 },
    recommendation: String
  },
  { timestamps: true }
);

interestSnapshotSchema.index({ itemId: 1, createdAt: -1 });

export const InterestSnapshot = mongoose.model("InterestSnapshot", interestSnapshotSchema);
