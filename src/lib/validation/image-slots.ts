import { z } from "zod";
import { assetUrlSchema } from "./common";

export const imageSlotUpdateSchema = z.object({
  slotId: z.string().trim().min(1).max(120),
  url: assetUrlSchema.optional(),
  alt: z.string().trim().max(500).optional(),
  action: z.enum(["update", "clear"]).optional().default("update"),
});

export type ImageSlotUpdateSchema = z.infer<typeof imageSlotUpdateSchema>;
