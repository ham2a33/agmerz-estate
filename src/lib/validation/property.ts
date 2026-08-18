import { z } from "zod";
import {
  numericString,
  optionalNumericString,
  optionalString,
  slugSchema,
  urlSchema,
} from "./common";

const propertyTypeSchema = z.enum(["apartment", "house", "commercial", "land", "rent"]);
const propertyStatusSchema = z.enum(["active", "reserved", "sold", "rented", "draft"]);

export const propertyFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: slugSchema,
  type: propertyTypeSchema,
  deal: z.enum(["sale", "rent"]),
  status: propertyStatusSchema,
  price: numericString("price"),
  area: numericString("area").refine((value) => Number(value) > 0, {
    message: "Area must be greater than 0",
  }),
  rooms: optionalNumericString,
  floor: optionalNumericString,
  totalFloors: optionalNumericString,
  yearBuilt: optionalNumericString,
  address: z.string().trim().min(1, "Address is required").max(500),
  district: z.string().trim().min(1, "District is required").max(200),
  lat: optionalString,
  lng: optionalString,
  description: z.string().trim().max(10000),
  features: z.array(z.string().trim().min(1).max(120)).max(50),
  images: z
    .array(urlSchema.refine((value) => value.length > 0, { message: "Image URL is required" }))
    .max(30),
});

export type PropertyFormSchema = z.infer<typeof propertyFormSchema>;
