import type { Client } from "@/types";

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getClientFullName(client: Pick<Client, "firstName" | "lastName">): string {
  return [client.firstName, client.lastName].filter(Boolean).join(" ").trim();
}

export function getPhoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : `tel:${phone}`;
}

export function getEmailHref(email: string): string {
  return `mailto:${email.trim()}`;
}
