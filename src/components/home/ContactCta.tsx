import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import type { StoreConfig } from "@/lib/store-config.types";
import type { HomepageContactCtaConfig } from "@/types/homepage";

interface ContactCtaProps {
  config: StoreConfig;
  contactCta: HomepageContactCtaConfig;
}

export function ContactCta({ config, contactCta }: ContactCtaProps) {
  return (
    <section className="section-padding">
      <Container>
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16 lg:px-20">
          <h2 className="heading-section mx-auto max-w-2xl text-foreground">{contactCta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {contactCta.text}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href={contactCta.buttonLink} variant="dark" size="lg">
              {contactCta.buttonText}
            </LinkButton>
            <LinkButton href={config.whatsapp.href} variant="outline" size="lg">
              WhatsApp
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
