import { z } from "zod";
import { assetUrlSchema } from "./common";

export const reviewCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  avatar: assetUrlSchema.nullable().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(1, "Text is required").max(5000),
  isPublished: z.boolean().optional().default(true),
});

export const reviewUpdateSchema = reviewCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);

export type ReviewCreateSchema = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateSchema = z.infer<typeof reviewUpdateSchema>;
