import { z } from "zod";
import { urlSchema } from "./common";

export const mediaUpdateSchema = z
  .object({
    alt: z.string().trim().max(300).nullable().optional(),
    title: z.string().trim().max(300).nullable().optional(),
    url: urlSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type MediaUpdateSchema = z.infer<typeof mediaUpdateSchema>;
