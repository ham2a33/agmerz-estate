import type {
  Property,
  PropertyCreateInput,
  PropertyStatus,
  PropertyType,
} from "@/types";

export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Квартира" },
  { value: "house", label: "Дом" },
  { value: "commercial", label: "Коммерция" },
  { value: "land", label: "Участок" },
  { value: "rent", label: "Аренда" },
];

export const PROPERTY_FEATURE_OPTIONS = [
  "Панорамные окна",
  "Паркинг",
  "Консьерж",
  "Балкон",
  "Терраса",
  "Сад",
  "Охрана",
  "Лифт",
  "Кладовая",
  "Мебель",
  "Ремонт",
  "Коммуникации",
];

export const TYPE_TO_CATEGORY: Record<PropertyType, string> = {
  apartment: "apartments",
  house: "houses",
  commercial: "commercial",
  land: "land",
  rent: "rent",
};

export interface PropertyFormValues {
  title: string;
  slug: string;
  type: PropertyType;
  deal: "sale" | "rent";
  status: PropertyStatus;
  price: string;
  area: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  address: string;
  district: string;
  lat: string;
  lng: string;
  description: string;
  features: string[];
  images: string[];
}

export const EMPTY_PROPERTY_FORM: PropertyFormValues = {
  title: "",
  slug: "",
  type: "apartment",
  deal: "sale",
  status: "draft",
  price: "",
  area: "",
  rooms: "",
  floor: "",
  totalFloors: "",
  yearBuilt: "",
  address: "",
  district: "",
  lat: "",
  lng: "",
  description: "",
  features: [],
  images: [],
};

export function generatePropertySlug(title: string): string {
  const transliterationMap: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  const normalized = title
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => transliterationMap[char] ?? char)
    .join("");

  return normalized
    .replace(/[«»"']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function getDealTypeFromProperty(type: PropertyType): "sale" | "rent" {
  return type === "rent" ? "rent" : "sale";
}

export function resolvePropertyType(deal: "sale" | "rent", type: PropertyType): PropertyType {
  if (deal === "rent") return "rent";
  if (type === "rent") return "apartment";
  return type;
}

export function showsRoomFields(type: PropertyType): boolean {
  return type === "apartment" || type === "house" || type === "rent";
}

export function showsFloorFields(type: PropertyType): boolean {
  return type === "apartment" || type === "commercial" || type === "rent";
}

export function isValidUrl(value: string): boolean {
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function propertyToFormValues(property: Property): PropertyFormValues {
  return {
    title: property.title,
    slug: property.slug,
    type: property.type,
    deal: getDealTypeFromProperty(property.type),
    status: property.status,
    price: String(property.price),
    area: String(property.area),
    rooms: property.rooms !== null ? String(property.rooms) : "",
    floor: property.floor !== null ? String(property.floor) : "",
    totalFloors: property.totalFloors !== null ? String(property.totalFloors) : "",
    yearBuilt: property.yearBuilt !== null ? String(property.yearBuilt) : "",
    address: property.address,
    district: property.district,
    lat: property.coordinates ? String(property.coordinates.lat) : "",
    lng: property.coordinates ? String(property.coordinates.lng) : "",
    description: property.description,
    features: [...property.features],
    images: [...property.images],
  };
}

export function formValuesToPropertyInput(values: PropertyFormValues): PropertyCreateInput {
  const type = resolvePropertyType(values.deal, values.type);
  const lat = values.lat.trim();
  const lng = values.lng.trim();

  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    type,
    category: TYPE_TO_CATEGORY[type],
    status: values.status,
    price: Number(values.price),
    currency: "₽",
    address: values.address.trim(),
    district: values.district.trim(),
    area: Number(values.area),
    rooms: showsRoomFields(type) && values.rooms.trim() ? Number(values.rooms) : null,
    floor: showsFloorFields(type) && values.floor.trim() ? Number(values.floor) : null,
    totalFloors:
      showsFloorFields(type) && values.totalFloors.trim() ? Number(values.totalFloors) : null,
    yearBuilt: values.yearBuilt.trim() ? Number(values.yearBuilt) : null,
    description: values.description.trim(),
    features: values.features,
    images: values.images,
    coordinates:
      lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
        ? { lat: Number(lat), lng: Number(lng) }
        : null,
    isFeatured: false,
    featuredOrder: null,
  };
}

export function validatePropertyForm(values: PropertyFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) errors.title = "Укажите название";

  if (!values.slug.trim()) {
    errors.slug = "Укажите slug";
  } else if (!isValidSlug(values.slug.trim())) {
    errors.slug = "Slug может содержать только латинские буквы, цифры и дефисы";
  }

  if (!values.price.trim()) {
    errors.price = "Укажите цену";
  } else if (Number(values.price) < 0 || Number.isNaN(Number(values.price))) {
    errors.price = "Цена должна быть не меньше 0";
  }

  if (!values.area.trim()) {
    errors.area = "Укажите площадь";
  } else if (Number(values.area) <= 0 || Number.isNaN(Number(values.area))) {
    errors.area = "Площадь должна быть больше 0";
  }

  if (values.rooms.trim()) {
    const rooms = Number(values.rooms);
    if (Number.isNaN(rooms) || rooms < 0) errors.rooms = "Комнат не может быть меньше 0";
  }

  if (values.lat.trim() && Number.isNaN(Number(values.lat))) {
    errors.lat = "Укажите корректную широту";
  }

  if (values.lng.trim() && Number.isNaN(Number(values.lng))) {
    errors.lng = "Укажите корректную долготу";
  }

  values.images.forEach((image, index) => {
    if (!isValidUrl(image)) {
      errors[`images.${index}`] = "Укажите корректный URL изображения";
    }
  });

  return errors;
}
