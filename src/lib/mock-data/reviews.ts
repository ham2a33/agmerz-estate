import type { Review } from "@/types";

export const mockReviews: Review[] = [
  {
    id: "1",
    name: "Амина Х.",
    avatar: null,
    rating: 5,
    text: "AGMERZ ESTATE помогли найти квартиру мечты за две недели. Профессиональный подход, прозрачные условия и полное сопровождение сделки.",
    isPublished: true,
    createdAt: "2025-11-10T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Руслан М.",
    avatar: null,
    rating: 5,
    text: "Покупали дом для семьи — команда учла все наши пожелания. От первого звонка до ключей всё прошло гладко и без лишней суеты.",
    isPublished: true,
    createdAt: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Зарема К.",
    avatar: null,
    rating: 5,
    text: "Обратились за коммерческим помещением. Подобрали несколько вариантов, помогли с переговорами. Рекомендую!",
    isPublished: true,
    createdAt: "2025-09-20T00:00:00.000Z",
  },
];
