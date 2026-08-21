import { z } from "zod";
import {
  optionalNumericString,
  optionalString,
  slugSchema,
} from "./common";

const propertyTypeSchema = z.enum(["apartment", "house", "commercial", "land", "rent"]);
const propertyStatusSchema = z.enum(["active", "reserved", "sold", "rented", "draft"]);

const propertyImageSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value.length > 0, { message: "Укажите URL изображения" })
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    { message: "Укажите корректный URL изображения" },
  );

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export const propertyFormSchema = z.object({
  title: z.string().trim().min(1, "Укажите название").max(300),
  slug: slugSchema.refine((value) => value.length > 0, { message: "Укажите slug" }),
  type: propertyTypeSchema,
  deal: z.enum(["sale", "rent"]),
  status: propertyStatusSchema,
  price: z
    .string()
    .trim()
    .min(1, "Укажите цену")
    .refine((value) => !Number.isNaN(Number(value)), { message: "Укажите корректную цену" }),
  area: z
    .string()
    .trim()
    .min(1, "Укажите площадь")
    .refine((value) => !Number.isNaN(Number(value)), { message: "Укажите корректную площадь" })
    .refine((value) => Number(value) > 0, {
      message: "Площадь должна быть больше 0",
    }),
  rooms: optionalNumericString,
  floor: optionalNumericString,
  totalFloors: optionalNumericString,
  yearBuilt: optionalNumericString,
  address: z.string().trim().min(1, "Укажите адрес").max(500),
  district: z.string().trim().min(1, "Выберите район").max(200),
  lat: optionalString,
  lng: optionalString,
  description: z.string().trim().max(10000).optional().default(""),
  features: z.preprocess(stringArray, z.array(z.string().trim().min(1).max(120)).max(50)),
  images: z.preprocess(stringArray, z.array(propertyImageSchema).max(30)),
});

export type PropertyFormSchema = z.infer<typeof propertyFormSchema>;

export const PROPERTY_FORM_FIELD_LABELS: Record<string, string> = {
  title: "Название",
  slug: "Slug",
  type: "Тип недвижимости",
  deal: "Сделка",
  status: "Статус",
  price: "Цена",
  area: "Площадь",
  rooms: "Комнаты",
  floor: "Этаж",
  totalFloors: "Этажей в здании",
  yearBuilt: "Год постройки",
  address: "Адрес",
  district: "Район",
  lat: "Широта",
  lng: "Долгота",
  description: "Описание",
  features: "Особенности",
  images: "Изображения",
};
