import type { PropertyStatus, PropertyType } from "@/types";

const typeLabels: Record<PropertyType, string> = {
  apartment: "Квартира",
  house: "Дом",
  commercial: "Коммерция",
  land: "Участок",
  rent: "Аренда",
};

const statusLabels: Record<PropertyStatus, string> = {
  active: "В продаже",
  reserved: "Забронирован",
  sold: "Продан",
  rented: "Сдан",
  draft: "Черновик",
};

export function getPropertyTypeLabel(type: PropertyType): string {
  return typeLabels[type];
}

export function getPropertyStatusLabel(status: PropertyStatus): string {
  return statusLabels[status];
}
