import { z } from "zod";
import { emailSchema } from "./common";

export const authLoginSchema = z.object({
  email: emailSchema.refine((value) => value.length > 0, { message: "Email is required" }),
  password: z.string().min(1, "Password is required").max(256),
});
