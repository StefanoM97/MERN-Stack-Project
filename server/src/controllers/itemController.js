import { Item } from "../models/Item.js";
import { itemInputSchema } from "../validators/itemValidators.js";
import { normalizeKeyword } from "../utils/normalize.js";
import { serializeItem } from "../serializers/itemSerializers.js";

function normalizeInput(input) {
  return {
    ...input,
    keywords: [...new Set(input.keywords.map(normalizeKeyword).filter(Boolean))]
  };
}

export async function listOwnItems(req, res) {
  const items = await Item.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  return res.json({ items: items.map((item) => serializeItem(item)) });
}

export async function createItem(req, res) {
  const input = normalizeInput(itemInputSchema.parse(req.body));
  const item = await Item.create({
    ...input,
    ownerId: req.user._id,
    ownerSchoolDomain: req.user.schoolDomain
  });
  return res.status(201).json({ item: serializeItem(item) });
}

export async function getItem(req, res) {
  const item = await Item.findById(req.params.id).populate("ownerId");
  if (!item) return res.status(404).json({ error: "Item not found" });

  const isOwner = item.ownerId._id.toString() === req.user._id.toString();
  const visible =
    isOwner ||
    item.visibility === "Public" ||
    (item.visibility === "School" &&
      req.user.schoolDomain &&
      item.ownerSchoolDomain === req.user.schoolDomain);

  if (!visible) return res.status(403).json({ error: "You cannot view this item" });
  return res.json({ item: serializeItem(item, { includeOwner: !isOwner }), isOwner });
}

export async function updateItem(req, res) {
  const input = normalizeInput(itemInputSchema.parse(req.body));
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { ...input, ownerSchoolDomain: req.user.schoolDomain },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.json({ item: serializeItem(item) });
}

export async function deleteItem(req, res) {
  const item = await Item.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.status(204).end();
}
