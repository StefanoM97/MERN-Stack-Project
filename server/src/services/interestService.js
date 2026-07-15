import { Item } from "../models/Item.js";
import { SearchMetric } from "../models/SearchMetric.js";
import { normalizeKeyword } from "../utils/normalize.js";

function keywordFilter(keyword) {
  const terms = normalizeKeyword(keyword).split(" ").filter(Boolean);
  const regex = new RegExp(terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
  return { $or: [{ title: regex }, { description: regex }, { keywords: { $in: terms } }] };
}

export async function getInternalSignals(keyword, schoolDomain = "") {
  const filter = keywordFilter(keyword);
  const [matchingItemCount, matchingPublicCount, matchingSchoolCount, searchCount] =
    await Promise.all([
      Item.countDocuments(filter),
      Item.countDocuments({ ...filter, visibility: "Public" }),
      schoolDomain
        ? Item.countDocuments({
            ...filter,
            visibility: "School",
            ownerSchoolDomain: schoolDomain
          })
        : Promise.resolve(0),
      SearchMetric.countDocuments({ normalizedKeyword: normalizeKeyword(keyword) })
    ]);

  return { matchingItemCount, matchingPublicCount, matchingSchoolCount, searchCount };
}

export function calculateReuseScore({ ebay, youtube, internal }) {
  const marketplace = ebay
    ? Math.min(40, Math.log10(Math.max(1, ebay.totalListings || 0)) * 12 + (ebay.sampleSize ? 8 : 0))
    : 0;
  const media = youtube
    ? Math.min(25, Math.log10(Math.max(1, youtube.totalViews || 0)) * 4)
    : 0;
  const community = Math.min(
    35,
    (internal.matchingItemCount || 0) * 2 +
      (internal.matchingPublicCount || 0) * 2 +
      (internal.matchingSchoolCount || 0) * 3 +
      Math.log10(Math.max(1, internal.searchCount || 0)) * 5
  );

  return Math.round(Math.min(100, marketplace + media + community));
}

export function recommendationFor(score, ebay) {
  if (score >= 75) return "High reuse potential. Consider lending, selling, or donating.";
  if (score >= 45) {
    return "Moderate reuse potential. Check community interest before discarding.";
  }
  if ((ebay?.averagePrice || 0) >= 25) {
    return "Marketplace value exists. Consider resale or donation.";
  }
  return "Low measured interest, but donation or responsible recycling may still be appropriate.";
}
