import { z } from "zod";
import {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  ITEM_STATUSES,
  ITEM_VISIBILITIES
} from "../models/Item.js";

const optionalUrl = z.union([z.string().url().max(1000), z.literal("")]).optional();

export const itemInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1200).optional().default(""),
  category: z.enum(ITEM_CATEGORIES),
  condition: z.enum(ITEM_CONDITIONS),
  status: z.enum(ITEM_STATUSES),
  quantity: z.coerce.number().int().min(1).max(999).optional().default(1),
  locationLabel: z.string().trim().max(100).optional().default(""),
  visibility: z.enum(ITEM_VISIBILITIES).optional().default("Private"),
  keywords: z.array(z.string().trim().min(1).max(40)).max(12).optional().default([]),
  imageUrl: optionalUrl.default("")
});
