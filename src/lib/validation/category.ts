import { z } from "zod";
import { assetUrlSchema, slugSchema } from "./common";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: slugSchema,
  description: z.string().trim().max(2000).optional().default(""),
  image: assetUrlSchema.optional().default(""),
  isActive: z.boolean(),
  sortOrder: z
    .string()
    .trim()
    .min(1, "Sort order is required")
    .refine((value) => !Number.isNaN(Number(value)), { message: "Invalid sort order" }),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
