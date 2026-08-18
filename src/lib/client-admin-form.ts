import type { Client, ClientStatus, ClientType } from "@/types";

export interface ClientFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  type: ClientType;
  status: ClientStatus;
  notes: string;
  assignedManager: string;
}

export const EMPTY_CLIENT_FORM: ClientFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  type: "buyer",
  status: "new",
  notes: "",
  assignedManager: "",
};

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    email: client.email,
    type: client.type,
    status: client.status,
    notes: client.notes,
    assignedManager: client.assignedManager,
  };
}

export function formValuesToClientInput(values: ClientFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    type: values.type,
    status: values.status,
    notes: values.notes.trim(),
    assignedManager: values.assignedManager.trim(),
  };
}

export function validateClientForm(values: ClientFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.firstName.trim()) errors.firstName = "Укажите имя";

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Некорректный email";
  }

  return errors;
}
