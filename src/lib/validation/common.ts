import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const emailSchema = z
  .string()
  .trim()
  .max(254)
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Invalid email",
  });

export const phoneSchema = z.string().trim().min(5, "Phone is required").max(32);

export const optionalPhoneSchema = z.string().trim().max(32);

export const urlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "Invalid URL",
  });

export const assetUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      z.string().url().safeParse(value).success,
    { message: "Invalid asset URL" },
  );

export const idSchema = z.string().trim().min(1).max(64);

export const optionalIdSchema = z.string().trim().max(64).nullable().optional();

export const nonEmptyString = z.string().trim().min(1).max(5000);
export const optionalString = z.string().trim().max(5000).optional().default("");

export const numericString = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required`)
    .refine((value) => !Number.isNaN(Number(value)), { message: `Invalid ${field}` });

export const optionalNumericString = z
  .string()
  .trim()
  .refine((value) => value === "" || !Number.isNaN(Number(value)), {
    message: "Invalid number",
  })
  .optional()
  .default("");
