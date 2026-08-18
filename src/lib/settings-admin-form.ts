import type { RequestStatus, SiteSettings } from "@/types";

export type SettingsFormValues = SiteSettings;

export function settingsToFormValues(settings: SiteSettings): SettingsFormValues {
  return { ...settings };
}

export function validateSettingsForm(values: SettingsFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.agencyName.trim()) errors.agencyName = "Укажите название агентства";

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Некорректный email";
  }

  if (values.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
    errors.contactEmail = "Некорректный email";
  }

  if (values.leadEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.leadEmail)) {
    errors.leadEmail = "Некорректный email";
  }

  const validStatuses: RequestStatus[] = ["new", "in_progress", "completed", "cancelled"];
  if (!validStatuses.includes(values.defaultRequestStatus)) {
    errors.defaultRequestStatus = "Некорректный статус";
  }

  return errors;
}
