import { z } from "zod";
import { assetUrlSchema } from "./common";

const homepageHeroSchema = z.object({
  enabled: z.boolean(),
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(1000),
  imageUrl: assetUrlSchema,
  ctaText: z.string().trim().min(1).max(120),
  ctaLink: z.string().trim().min(1).max(300),
});

const homepageFeaturedSchema = z.object({
  enabled: z.boolean(),
});

const homepageAboutSchema = z.object({
  title: z.string().trim().min(1).max(300),
  text: z.string().trim().max(3000),
});

const homepageServicesSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(3000),
});

const homepageContactCtaSchema = z.object({
  title: z.string().trim().min(1).max(300),
  text: z.string().trim().max(1000),
  buttonText: z.string().trim().min(1).max(120),
  buttonLink: z.string().trim().min(1).max(300),
});

const homepageSectionImagesSchema = z.object({
  homepageHero: assetUrlSchema,
  requestHero: assetUrlSchema,
  contactHero: assetUrlSchema,
});

export const homepageUpdateSchema = z
  .object({
    hero: homepageHeroSchema.partial().optional(),
    featured: homepageFeaturedSchema.partial().optional(),
    aboutSection: homepageAboutSchema.partial().optional(),
    servicesSection: homepageServicesSchema.partial().optional(),
    contactCta: homepageContactCtaSchema.partial().optional(),
    sectionImages: homepageSectionImagesSchema.partial().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const featuredReorderSchema = z.object({
  propertyIds: z.array(z.string().trim().min(1)).min(1).max(12),
});

export const propertyFeaturedSchema = z.object({
  isFeatured: z.boolean(),
  featuredOrder: z.number().int().min(1).max(999).nullable().optional(),
});

export type HomepageUpdateSchema = z.infer<typeof homepageUpdateSchema>;
