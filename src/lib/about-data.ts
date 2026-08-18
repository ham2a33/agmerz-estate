import { mockCategories } from "@/lib/mock-data/categories";
import { DEFAULT_STORE_CONFIG } from "@/lib/store-config.types";

export const aboutHero = {
  label: "О компании",
  title: "Недвижимость — это больше, чем квадратные метры",
  subtitle:
    "Мы помогаем людям находить места, которые становятся частью их жизни, и сопровождаем сделки с вниманием к каждой детали.",
  brand: DEFAULT_STORE_CONFIG.brand,
  city: DEFAULT_STORE_CONFIG.address.city,
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
};

export const aboutStory = {
  number: "01",
  label: DEFAULT_STORE_CONFIG.brand,
  paragraphs: [
    "AGMERZ ESTATE создана с идеей сделать работу с недвижимостью более понятной, внимательной и современной.",
    "Мы объединяем технологии, локальное знание рынка и персональный подход, чтобы клиенту было проще принимать важные решения.",
  ],
};

export const aboutApproach = [
  {
    number: "01",
    title: "Слушаем",
    description: "Сначала понимаем задачу клиента, а уже потом предлагаем решения.",
  },
  {
    number: "02",
    title: "Отбираем",
    description:
      "Не перегружаем десятками случайных вариантов. Фокусируемся на действительно подходящих объектах.",
  },
  {
    number: "03",
    title: "Проверяем",
    description: "Внимательно работаем с информацией об объекте и деталями сделки.",
  },
  {
    number: "04",
    title: "Сопровождаем",
    description: "Остаёмся рядом на каждом этапе процесса.",
  },
];

export const aboutLocalExpertise = {
  title: "Мы знаем Грозный",
  description:
    "Локальное знание рынка помогает нам лучше понимать районы, особенности объектов и запросы клиентов.",
  cityLabel: DEFAULT_STORE_CONFIG.address.city.toUpperCase(),
  tagline: "Локальная экспертиза",
  image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1000&q=80",
};

export const aboutCategories = mockCategories.map(({ title, href }) => ({
  title,
  href,
}));

export const aboutWhatWeDo = [
  {
    title: "Покупка",
    description: "Подбор недвижимости под задачу клиента.",
  },
  {
    title: "Продажа",
    description: "Презентация и сопровождение продажи объекта.",
  },
  {
    title: "Аренда",
    description: "Подбор недвижимости и помощь в организации аренды.",
  },
  {
    title: "Коммерческая недвижимость",
    description: "Объекты для бизнеса и инвестиций.",
  },
];

export const aboutClientExperience = {
  title: "Клиент всегда в центре",
  description:
    "Мы считаем, что хорошая работа с недвижимостью начинается не с объекта, а с человека.",
  points: [
    "Понятная коммуникация",
    "Индивидуальный подход",
    "Актуальная информация",
    "Сопровождение",
  ],
  image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1000&q=80",
};

export const aboutTeam = {
  title: "Команда AGMERZ",
  description:
    "За каждым объектом и каждой заявкой стоят люди, которые помогают клиентам пройти путь от первого вопроса до решения.",
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
};

export const aboutTimeline = [
  {
    number: "01",
    title: "Запрос",
    description: "Вы рассказываете нам о своей задаче, бюджете и пожеланиях.",
  },
  {
    number: "02",
    title: "Подбор",
    description: "Формируем подборку объектов, которые соответствуют вашим критериям.",
  },
  {
    number: "03",
    title: "Просмотр",
    description: "Организуем просмотры и отвечаем на вопросы по каждому объекту.",
  },
  {
    number: "04",
    title: "Решение",
    description: "Помогаем сравнить варианты и определиться с выбором.",
  },
  {
    number: "05",
    title: "Сделка",
    description: "Сопровождаем процесс до завершения сделки.",
  },
];

export const aboutTrust = [
  {
    title: "Прозрачность",
    description: "Понятная информация и коммуникация.",
  },
  {
    title: "Внимание к деталям",
    description: "Изучаем особенности каждого запроса.",
  },
  {
    title: "Современный подход",
    description: "Используем технологии, чтобы сделать процесс удобнее.",
  },
  {
    title: "Долгосрочные отношения",
    description: "Хотим быть полезными не только в рамках одной сделки.",
  },
];

export const aboutFinalCta = {
  title: "Давайте познакомимся",
  description: "Расскажите нам, что вы ищете или какую задачу хотите решить.",
};
