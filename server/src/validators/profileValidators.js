import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  communityName: z.string().trim().max(100).optional().default(""),
  contact: z.object({
    emailVisible: z.boolean(),
    phone: z.string().trim().max(30).optional().default(""),
    phoneVisible: z.boolean(),
    preferredContact: z.enum(["email", "phone"])
  })
});
