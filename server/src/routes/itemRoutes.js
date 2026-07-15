import express from "express";
import {
  listOwnItems,
  createItem,
  getItem,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const itemRouter = express.Router();
itemRouter.use(requireAuth);
itemRouter.get("/", asyncHandler(listOwnItems));
itemRouter.post("/", asyncHandler(createItem));
itemRouter.get("/:id", asyncHandler(getItem));
itemRouter.put("/:id", asyncHandler(updateItem));
itemRouter.delete("/:id", asyncHandler(deleteItem));
