import { z } from "zod";
import { slugSchema, assetUrlSchema } from "./common";

export const blogCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: slugSchema,
  excerpt: z.string().trim().min(1, "Excerpt is required").max(1000),
  content: z.string().trim().max(50000).optional().default(""),
  coverImage: assetUrlSchema.nullable().optional(),
  author: z.string().trim().max(200).optional().default("AGMERZ ESTATE"),
  publishedAt: z.string().trim().max(64).nullable().optional(),
  isPublished: z.boolean().optional().default(false),
  contentBlocks: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const blogUpdateSchema = blogCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);

export type BlogCreateSchema = z.infer<typeof blogCreateSchema>;
export type BlogUpdateSchema = z.infer<typeof blogUpdateSchema>;
