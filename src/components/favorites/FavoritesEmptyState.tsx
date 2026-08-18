import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { favoritesHero } from "@/lib/favorites-data";

export function FavoritesEmptyState() {
  return (
    <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-10 md:py-16">
      <div className="relative mx-auto aspect-[16/10] max-w-md overflow-hidden rounded-3xl">
        <Image
          src={favoritesHero.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>

      <h2 className="heading-section mt-8 text-foreground">Здесь пока ничего нет</h2>
      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
        Сохраняйте понравившиеся объекты, нажимая на ♡ в каталоге или на странице объекта.
      </p>

      <div className="mt-8">
        <LinkButton href="/catalog" variant="dark" size="lg" className="w-full sm:w-auto">
          Перейти в каталог
        </LinkButton>
      </div>
    </div>
  );
}
