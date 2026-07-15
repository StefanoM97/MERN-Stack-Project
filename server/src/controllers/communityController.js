import { Item } from "../models/Item.js";
import { SearchMetric } from "../models/SearchMetric.js";
import { normalizeKeyword } from "../utils/normalize.js";
import { serializeItem } from "../serializers/itemSerializers.js";

export async function searchCommunity(req, res) {
  const search = normalizeKeyword(req.query.search || "");
  const category = String(req.query.category || "");
  const status = String(req.query.status || "");
  const scope = String(req.query.scope || "community");
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);

  const visibility =
    scope === "public" || !req.user.schoolDomain
      ? { visibility: "Public" }
      : {
          $or: [
            { visibility: "Public" },
            { visibility: "School", ownerSchoolDomain: req.user.schoolDomain }
          ]
        };

  const filter = { ...visibility, ownerId: { $ne: req.user._id } };
  if (category) filter.category = category;
  if (status) filter.status = status;

  if (search) {
    const terms = search.split(" ").filter(Boolean);
    const regex = new RegExp(terms.join("|"), "i");
    filter.$and = [{ $or: [{ title: regex }, { description: regex }, { keywords: { $in: terms } }] }];
    await SearchMetric.create({
      normalizedKeyword: search,
      userId: req.user._id,
      schoolDomain: req.user.schoolDomain
    });
  }

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate("ownerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Item.countDocuments(filter)
  ]);

  return res.json({
    items: items.map((item) => serializeItem(item, { includeOwner: true })),
    total,
    page,
    pages: Math.ceil(total / limit)
  });
}
