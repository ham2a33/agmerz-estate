import type { ClientStatus, ClientType, PropertyStatus, RequestStatus, RequestType } from "@/types";

const requestTypeLabels: Record<RequestType, string> = {
  buy: "Покупка",
  rent: "Аренда",
  sell: "Продажа",
  consultation: "Консультация",
  contact: "Контакт",
};

const requestStatusLabels: Record<RequestStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
};

const propertyStatusLabels: Record<PropertyStatus, string> = {
  active: "Активный",
  reserved: "Зарезервирован",
  sold: "Продан",
  rented: "Сдан",
  draft: "Черновик",
};

const clientTypeLabels: Record<ClientType, string> = {
  buyer: "Покупатель",
  seller: "Продавец",
  renter: "Арендатор",
  landlord: "Арендодатель",
  investor: "Инвестор",
};

const clientStatusLabels: Record<ClientStatus, string> = {
  new: "Новый",
  active: "Активный",
  in_progress: "В работе",
  completed: "Завершён",
  inactive: "Неактивный",
};

export function getClientTypeLabel(type: ClientType): string {
  return clientTypeLabels[type];
}

export function getClientStatusLabel(status: ClientStatus): string {
  return clientStatusLabels[status];
}

export function getCategoryStatusLabel(isActive: boolean): string {
  return isActive ? "Активна" : "Скрыта";
}

export function getRequestTypeLabel(type: RequestType): string {
  return requestTypeLabels[type];
}

export function getRequestStatusLabel(status: RequestStatus): string {
  return requestStatusLabels[status];
}

export function getAdminPropertyStatusLabel(status: PropertyStatus): string {
  return propertyStatusLabels[status];
}
