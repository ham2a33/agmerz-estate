import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactHero } from "@/components/contacts/ContactHero";
import { ContactCards } from "@/components/contacts/ContactCards";
import { ContactOffice } from "@/components/contacts/ContactOffice";
import { ContactWorkingHours } from "@/components/contacts/ContactWorkingHours";
import { ContactFaq } from "@/components/contacts/ContactFaq";
import { ContactFinalCta } from "@/components/contacts/ContactFinalCta";
import { getStoreConfig } from "@/lib/store-config.server";
import { getHomepageConfig } from "@/lib/homepage";

export const metadata: Metadata = {
  title: "Контакты — AGMERZ ESTATE",
  description:
    "Свяжитесь с AGMERZ ESTATE. Поможем подобрать недвижимость, организовать просмотр и ответим на ваши вопросы.",
};

export default async function ContactsPage() {
  const [config, homepage] = await Promise.all([getStoreConfig(), getHomepageConfig()]);

  return (
    <>
      <ContactHero config={config} heroImageUrl={homepage.sectionImages.contactHero} />

      <section className="section-padding pb-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <ContactCards config={config} />
            <ContactForm />
          </div>

          <div className="mt-12 md:mt-16">
            <ContactOffice config={config} />
            <ContactWorkingHours config={config} />
            <ContactFaq />
          </div>
        </Container>
      </section>

      <ContactFinalCta />
    </>
  );
}
