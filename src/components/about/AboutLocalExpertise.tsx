import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { aboutCategories, aboutLocalExpertise } from "@/lib/about-data";
import { resolveImageSlot } from "@/lib/image-slots";

export async function AboutLocalExpertise() {
  const image = await resolveImageSlot("about.local-expertise");

  return (
    <section className="section-padding">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4] lg:order-2">
            <Image
              src={image.url}
              alt={image.alt || "Грозный — локальная экспертиза AGMERZ ESTATE"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-surface">
              <p className="text-xs font-medium uppercase tracking-[0.2em]">
                {aboutLocalExpertise.cityLabel}
              </p>
              <p className="mt-1 text-sm text-surface/90">{aboutLocalExpertise.tagline}</p>
            </div>
          </div>

          <div className="lg:order-1">
            <h2 className="heading-section text-foreground">{aboutLocalExpertise.title}</h2>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              {aboutLocalExpertise.description}
            </p>

            <div className="mt-10 border-t border-border pt-8">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Направления
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {aboutCategories.map((category) => (
                  <li key={category.href}>
                    <Link
                      href={category.href}
                      className="inline-block rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/40 hover:bg-surface-muted"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
