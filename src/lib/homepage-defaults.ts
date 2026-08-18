import type { HomepageConfig } from "@/types/homepage";

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  hero: {
    enabled: true,
    title: "Недвижимость, которую хочется назвать домом",
    subtitle:
      "Подберём недвижимость, которая соответствует вашему образу жизни, бюджету и целям.",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ctaText: "Смотреть объекты",
    ctaLink: "/catalog",
  },
  featured: {
    enabled: true,
  },
  aboutSection: {
    title: "AGMERZ ESTATE",
    text: "Мы — премиальное агентство недвижимости в Грозном. Помогаем клиентам найти недвижимость, которая соответствует их образу жизни, целям и бюджету.",
  },
  servicesSection: {
    title: "Полный комплекс услуг",
    description: "Покупка, продажа, аренда и подбор недвижимости с персональным сопровождением.",
  },
  contactCta: {
    title: "Готовы найти свою недвижимость?",
    text: "Свяжитесь с AGMERZ ESTATE — расскажите, что вы ищете, и мы поможем подобрать подходящий вариант.",
    buttonText: "Связаться",
    buttonLink: "/contacts",
  },
  sectionImages: {
    homepageHero:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    requestHero:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    contactHero:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
  },
};
