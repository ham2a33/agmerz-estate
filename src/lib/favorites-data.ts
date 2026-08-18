export const favoritesHero = {
  label: "Избранное",
  title: "Объекты, которые вам понравились",
  subtitle: "Сохраняйте интересующие объекты, чтобы вернуться к ним позже.",
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&q=80",
};

export const favoritesFinalCta = {
  title: "Не нашли подходящий вариант?",
  description: "Расскажите нам, какую недвижимость вы ищете, и мы подберём подходящие объекты.",
};

export function getObjectCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "объект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "объекта";
  return "объектов";
}
