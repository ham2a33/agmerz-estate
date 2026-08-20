import { z } from "zod";
import { assetUrlSchema } from "./common";

const pageHeroPartialSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(3000).optional(),
  imageUrl: assetUrlSchema.optional(),
});

export const pagesUpdateSchema = z
  .object({
    catalog: pageHeroPartialSchema.optional(),
    services: pageHeroPartialSchema.optional(),
    about: pageHeroPartialSchema.optional(),
    blog: pageHeroPartialSchema.optional(),
    contacts: pageHeroPartialSchema.optional(),
    favorites: pageHeroPartialSchema.optional(),
    request: pageHeroPartialSchema.optional(),
  })
  .refine((value) => Object.values(value).some(Boolean), {
    message: "At least one page field is required",
  });

export type PagesUpdateSchema = z.infer<typeof pagesUpdateSchema>;
