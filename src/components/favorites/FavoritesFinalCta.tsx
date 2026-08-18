import { LinkButton } from "@/components/ui/Button";
import { favoritesFinalCta } from "@/lib/favorites-data";

export function FavoritesFinalCta() {
  return (
    <section className="mt-12 border-t border-border pt-12 md:mt-16 md:pt-16">
      <div className="rounded-3xl border border-border bg-surface px-6 py-10 text-center md:px-10 md:py-12">
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">{favoritesFinalCta.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          {favoritesFinalCta.description}
        </p>
        <div className="mt-8">
          <LinkButton href="/request" variant="dark" size="lg" className="w-full sm:w-auto">
            Подобрать недвижимость
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
