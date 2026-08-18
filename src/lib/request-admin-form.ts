import type { Request, RequestStatus, RequestType } from "@/types";

export interface RequestFormValues {
  name: string;
  phone: string;
  email: string;
  type: RequestType;
  status: RequestStatus;
  budget: string;
  district: string;
  rooms: string;
  message: string;
  internalNotes: string;
}

export function requestToFormValues(request: Request): RequestFormValues {
  return {
    name: request.name,
    phone: request.phone,
    email: request.email,
    type: request.type,
    status: request.status,
    budget: request.budget !== null ? String(request.budget) : "",
    district: request.district ?? "",
    rooms: request.rooms !== null ? String(request.rooms) : "",
    message: request.message,
    internalNotes: request.internalNotes,
  };
}

export function formValuesToRequestUpdate(values: RequestFormValues) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    type: values.type,
    status: values.status,
    budget: values.budget.trim() ? Number(values.budget) : null,
    district: values.district.trim() || null,
    rooms: values.rooms.trim() ? Number(values.rooms) : null,
    message: values.message.trim(),
    internalNotes: values.internalNotes.trim(),
  };
}

export function validateRequestAdminForm(values: RequestFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) errors.name = "Укажите имя";
  if (!values.phone.trim()) errors.phone = "Укажите телефон";

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Некорректный email";
  }

  if (values.budget.trim() && Number.isNaN(Number(values.budget))) {
    errors.budget = "Укажите корректный бюджет";
  }

  if (values.rooms.trim() && Number.isNaN(Number(values.rooms))) {
    errors.rooms = "Укажите корректное число комнат";
  }

  return errors;
}
