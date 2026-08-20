import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { investmentService, sellRentCta } from "@/lib/services-data";
import { resolveImageSlot } from "@/lib/image-slots";

export async function ServicesCta() {
  const bannerImage = await resolveImageSlot("services.sell-rent-cta");

  return (
    <>
      <section className="section-padding pb-0">
        <Container>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3] md:aspect-[21/9]">
              <Image
                src={bannerImage.url}
                alt={bannerImage.alt || sellRentCta.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/50" />
            </div>

            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-14 lg:p-16">
                <h2 className="max-w-2xl font-serif text-3xl leading-tight text-surface md:text-4xl lg:text-5xl">
                  {sellRentCta.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-surface/85 md:text-lg">
                  {sellRentCta.description}
                </p>
                <div className="mt-8">
                  <LinkButton href={sellRentCta.href} variant="primary" size="lg">
                    {sellRentCta.ctaLabel}
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <div className="grid gap-8 rounded-3xl border border-border bg-surface p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                {investmentService.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                {investmentService.description}
              </p>
            </div>
            <LinkButton href={investmentService.href} variant="outline" size="lg" className="shrink-0">
              {investmentService.ctaLabel}
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
