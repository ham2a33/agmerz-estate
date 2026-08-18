export const CONTACT_TOPICS = [
  "Общий вопрос",
  "Подбор недвижимости",
  "Просмотр объекта",
  "Продажа недвижимости",
  "Аренда",
  "Сотрудничество",
  "Другое",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  topic: ContactTopic | "";
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData | "form", string>>;

export const INITIAL_CONTACT_FORM: ContactFormData = {
  name: "",
  phone: "",
  email: "",
  topic: "",
  message: "",
};

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) errors.name = "Укажите имя";
  if (!data.phone.trim()) errors.phone = "Укажите телефон";
  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Некорректный email";
  }
  if (!data.message.trim()) errors.message = "Напишите сообщение";

  return errors;
}

export function buildContactPayload(data: ContactFormData) {
  const topicLine = data.topic ? `Тема: ${data.topic}. ` : "";
  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    type: "contact" as const,
    budget: null,
    district: null,
    rooms: null,
    message: `${topicLine}${data.message.trim()}`,
  };
}
