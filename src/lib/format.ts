export function formatPrice(price: number, currency = "₽"): string {
  return `${price.toLocaleString("ru-RU")} ${currency}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
