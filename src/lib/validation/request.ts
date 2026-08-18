import { z } from "zod";
import { emailSchema, optionalIdSchema, phoneSchema } from "./common";

const requestTypeSchema = z.enum(["buy", "rent", "sell", "consultation", "contact"]);
const requestStatusSchema = z.enum(["new", "in_progress", "completed", "cancelled"]);

export const requestCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  phone: phoneSchema,
  email: emailSchema.optional().default(""),
  type: requestTypeSchema,
  budget: z.number().int().min(0).nullable().optional(),
  district: z.string().trim().max(200).nullable().optional(),
  rooms: z.number().int().min(0).max(100).nullable().optional(),
  message: z.string().trim().max(5000).optional().default(""),
  clientId: optionalIdSchema,
  propertyId: optionalIdSchema,
});

export const requestUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  phone: phoneSchema,
  email: emailSchema.optional().default(""),
  type: requestTypeSchema,
  status: requestStatusSchema,
  budget: z.string().trim().max(20),
  district: z.string().trim().max(200),
  rooms: z.string().trim().max(10),
  message: z.string().trim().max(5000),
  internalNotes: z.string().trim().max(5000),
});

export type RequestCreateSchema = z.infer<typeof requestCreateSchema>;
export type RequestUpdateSchema = z.infer<typeof requestUpdateSchema>;
