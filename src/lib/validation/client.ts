import { z } from "zod";
import { emailSchema, optionalPhoneSchema } from "./common";

const clientTypeSchema = z.enum(["buyer", "seller", "renter", "landlord", "investor"]);
const clientStatusSchema = z.enum(["new", "active", "in_progress", "completed", "inactive"]);

export const clientFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(120),
  lastName: z.string().trim().max(120).optional().default(""),
  phone: optionalPhoneSchema.optional().default(""),
  email: emailSchema.optional().default(""),
  type: clientTypeSchema,
  status: clientStatusSchema,
  notes: z.string().trim().max(5000).optional().default(""),
  assignedManager: z.string().trim().max(200).optional().default(""),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
