import { serializePublicUser } from "./userSerializers.js";

export function serializeItem(item, { includeOwner = false } = {}) {
  const plain = typeof item.toObject === "function" ? item.toObject() : item;
  const owner = plain.ownerId && typeof plain.ownerId === "object" && plain.ownerId.email
    ? plain.ownerId
    : null;

  return {
    id: plain._id.toString(),
    title: plain.title,
    description: plain.description,
    category: plain.category,
    condition: plain.condition,
    status: plain.status,
    quantity: plain.quantity,
    locationLabel: plain.locationLabel,
    visibility: plain.visibility,
    keywords: plain.keywords || [],
    imageUrl: plain.imageUrl,
    estimatedValue: plain.estimatedValue,
    owner: includeOwner && owner ? serializePublicUser(owner) : undefined,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt
  };
}
