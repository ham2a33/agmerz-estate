import type { RequestType } from "@/types";

export type PropertyLookingType = "apartment" | "house" | "commercial" | "land" | "rent";

export type DealType = "buy" | "rent";

export interface RequestFormData {
  propertyType: PropertyLookingType | "";
  dealType: DealType;
  district: string;
  undecidedDistrict: boolean;
  budgetMin: string;
  budgetMax: string;
  rooms: string;
  areaMin: string;
  areaMax: string;
  extras: string[];
  message: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export type RequestFormErrors = Partial<Record<keyof RequestFormData | "form", string>>;

export const REQUEST_DISTRICTS = [
  "Центральный",
  "Ленинский",
  "Ахматовский",
  "Байсангуровский",
  "Шейх-Мансуровский",
  "Старопромысловский",
];

export const PROPERTY_TYPE_OPTIONS: { value: PropertyLookingType; label: string }[] = [
  { value: "apartment", label: "Квартира" },
  { value: "house", label: "Дом" },
  { value: "commercial", label: "Коммерция" },
  { value: "land", label: "Участок" },
  { value: "rent", label: "Аренда" },
];

export const ROOM_OPTIONS = ["1", "2", "3", "4+"];

export const EXTRA_OPTIONS = [
  "Новостройка",
  "Вторичка",
  "С ремонтом",
  "Без ремонта",
  "Мебель",
  "Паркинг",
];

export const INITIAL_FORM_DATA: RequestFormData = {
  propertyType: "",
  dealType: "buy",
  district: "",
  undecidedDistrict: false,
  budgetMin: "",
  budgetMax: "",
  rooms: "",
  areaMin: "",
  areaMax: "",
  extras: [],
  message: "",
  name: "",
  phone: "",
  email: "",
  consent: false,
};

const PROPERTY_TYPE_LABELS: Record<PropertyLookingType, string> = {
  apartment: "Квартира",
  house: "Дом",
  commercial: "Коммерция",
  land: "Участок",
  rent: "Аренда",
};

export function validateRequestForm(data: RequestFormData): RequestFormErrors {
  const errors: RequestFormErrors = {};

  if (!data.propertyType) {
    errors.propertyType = "Выберите тип недвижимости";
  }

  if (!data.name.trim()) {
    errors.name = "Укажите имя";
  }

  if (!data.phone.trim()) {
    errors.phone = "Укажите телефон";
  }

  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Некорректный email";
  }

  if (data.budgetMin && Number(data.budgetMin) < 0) {
    errors.budgetMin = "Значение не может быть отрицательным";
  }

  if (data.budgetMax && Number(data.budgetMax) < 0) {
    errors.budgetMax = "Значение не может быть отрицательным";
  }

  if (data.budgetMin && data.budgetMax && Number(data.budgetMin) > Number(data.budgetMax)) {
    errors.budgetMax = "Максимум должен быть больше минимума";
  }

  if (data.areaMin && Number(data.areaMin) < 0) {
    errors.areaMin = "Значение не может быть отрицательным";
  }

  if (data.areaMax && Number(data.areaMax) < 0) {
    errors.areaMax = "Значение не может быть отрицательным";
  }

  if (data.areaMin && data.areaMax && Number(data.areaMin) > Number(data.areaMax)) {
    errors.areaMax = "Максимум должен быть больше минимума";
  }

  if (!data.consent) {
    errors.consent = "Необходимо согласие на обработку данных";
  }

  return errors;
}

export function buildRequestPayload(data: RequestFormData) {
  const requestType: RequestType = data.dealType === "rent" ? "rent" : "buy";

  const budget =
    data.budgetMax !== ""
      ? Number(data.budgetMax)
      : data.budgetMin !== ""
        ? Number(data.budgetMin)
        : null;

  const rooms =
    data.rooms === "4+"
      ? 4
      : data.rooms
        ? Number(data.rooms)
        : null;

  const district = data.undecidedDistrict
    ? "Не определился с районом"
    : data.district || null;

  const messageParts = [
    data.propertyType && `Тип недвижимости: ${PROPERTY_TYPE_LABELS[data.propertyType]}`,
    `Тип сделки: ${data.dealType === "rent" ? "Аренда" : "Покупка"}`,
    data.budgetMin && `Бюджет от: ${Number(data.budgetMin).toLocaleString("ru-RU")} ₽`,
    data.budgetMax && `Бюджет до: ${Number(data.budgetMax).toLocaleString("ru-RU")} ₽`,
    data.areaMin && `Площадь от: ${data.areaMin} м²`,
    data.areaMax && `Площадь до: ${data.areaMax} м²`,
    data.extras.length > 0 && `Параметры: ${data.extras.join(", ")}`,
    data.message.trim() && `Пожелания: ${data.message.trim()}`,
  ].filter(Boolean);

  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    type: requestType,
    budget,
    district,
    rooms,
    message: messageParts.join(". "),
  };
}

export function showRoomFields(propertyType: PropertyLookingType | ""): boolean {
  return propertyType === "apartment" || propertyType === "house" || propertyType === "rent";
}

export function showAreaFields(propertyType: PropertyLookingType | ""): boolean {
  return Boolean(propertyType);
}
