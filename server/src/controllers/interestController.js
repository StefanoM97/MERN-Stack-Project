import { Item } from "../models/Item.js";
import { InterestSnapshot } from "../models/InterestSnapshot.js";
import { normalizeKeyword } from "../utils/normalize.js";
import { searchEbay } from "../services/ebayService.js";
import { searchYouTube } from "../services/youtubeService.js";
import {
  getInternalSignals,
  calculateReuseScore,
  recommendationFor
} from "../services/interestService.js";

export async function checkInterest(req, res) {
  const item = await Item.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!item) return res.status(404).json({ error: "Item not found" });

  const keyword = normalizeKeyword(req.body.keyword || item.title);
  if (keyword.length < 2) return res.status(400).json({ error: "Keyword is too short" });

  const [ebayResult, youtubeResult, internal] = await Promise.all([
    searchEbay(keyword).catch((error) => ({ unavailable: true, error: error.message })),
    searchYouTube(keyword).catch((error) => ({ unavailable: true, error: error.message })),
    getInternalSignals(keyword, req.user.schoolDomain)
  ]);

  const ebay = ebayResult.unavailable ? null : ebayResult;
  const youtube = youtubeResult.unavailable ? null : youtubeResult;
  const reuseScore = calculateReuseScore({ ebay, youtube, internal });
  const recommendation = recommendationFor(reuseScore, ebay);

  const snapshot = await InterestSnapshot.create({
    itemId: item._id,
    ownerId: req.user._id,
    keyword,
    ebay: ebay || undefined,
    youtube: youtube || undefined,
    internal,
    reuseScore,
    recommendation
  });

  if (ebay?.sampleSize) {
    item.estimatedValue = {
      low: ebay.lowPrice,
      high: ebay.highPrice,
      average: ebay.averagePrice,
      currency: ebay.currency,
      checkedAt: new Date()
    };
    await item.save();
  }

  return res.json({
    snapshot,
    services: {
      ebay: ebayResult.unavailable
        ? { available: false, error: ebayResult.error }
        : { available: true },
      youtube: youtubeResult.unavailable
        ? { available: false, error: youtubeResult.error }
        : { available: true }
    }
  });
}

export async function interestHistory(req, res) {
  const item = await Item.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!item) return res.status(404).json({ error: "Item not found" });

  const snapshots = await InterestSnapshot.find({ itemId: item._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return res.json({ snapshots });
}
