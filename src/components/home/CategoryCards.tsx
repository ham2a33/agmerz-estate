import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { CategoryCardData } from "@/lib/category-image-fallback";

interface CategoryCardsProps {
  categories: CategoryCardData[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-24 lg:pt-12">
      <Container>
        <h2 className="heading-section text-foreground">Найдите подходящую недвижимость</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={category.href}
              className={`group card-hover relative overflow-hidden rounded-3xl ${index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <div
                className={`relative overflow-hidden bg-surface-muted ${index === 0 ? "aspect-[16/9] lg:aspect-auto lg:min-h-[480px]" : "aspect-[4/3]"}`}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                  className="object-cover image-hover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-sm text-surface/80">{category.count} объектов</p>
                  <h3 className="mt-1 font-serif text-2xl text-surface md:text-3xl">{category.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-surface/85">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-surface transition-transform duration-300 group-hover:translate-x-1">
                    Смотреть
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
