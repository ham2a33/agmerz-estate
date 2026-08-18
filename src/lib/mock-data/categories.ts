export interface MockCategory {
  slug: string;
  title: string;
  description: string;
  count: number;
  href: string;
  image: string;
}

export const mockCategories: MockCategory[] = [
  {
    slug: "apartments",
    title: "Квартиры",
    description: "Современные квартиры в лучших районах города",
    count: 48,
    href: "/catalog/apartments",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    slug: "houses",
    title: "Дома",
    description: "Коттеджи, таунхаусы и загородные дома",
    count: 23,
    href: "/catalog/houses",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    slug: "commercial",
    title: "Коммерция",
    description: "Офисы, торговые и производственные помещения",
    count: 15,
    href: "/catalog/commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    slug: "land",
    title: "Участки",
    description: "Земельные участки под строительство и инвестиции",
    count: 12,
    href: "/catalog/land",
    image: "https://images.unsplash.com/photo-1500382017468-90403fed87ef?w=800&q=80",
  },
  {
    slug: "rent",
    title: "Аренда",
    description: "Жилая и коммерческая недвижимость в аренду",
    count: 31,
    href: "/catalog/rent",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
];
