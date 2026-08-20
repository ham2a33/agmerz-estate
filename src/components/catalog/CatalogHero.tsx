import Image from "next/image";
import { Container } from "@/components/layout/Container";

interface CatalogHeroProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&q=80";

export function CatalogHero({
  title = "Каталог недвижимости",
  description = "Подберите квартиру, дом или коммерческий объект, который подходит именно вам.",
  imageUrl,
}: CatalogHeroProps) {
  const resolvedImageUrl = imageUrl || DEFAULT_IMAGE;

  return (
    <section className="border-b border-border/60 pb-10 pt-10 md:pb-12 md:pt-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div>
            <h1 className="heading-section text-foreground">{title}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
            <Image
              src={resolvedImageUrl}
              alt={title}
              fill
              sizes="320px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
