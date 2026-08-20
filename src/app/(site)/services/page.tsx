import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { FeaturedService } from "@/components/services/FeaturedService";
import { HowWeWork } from "@/components/services/HowWeWork";
import { WhyAgmerz } from "@/components/services/WhyAgmerz";
import { ServicesCta } from "@/components/services/ServicesCta";
import { ServicesFaq } from "@/components/services/ServicesFaq";
import { ServicesFinalCta } from "@/components/services/ServicesFinalCta";
import { getPagesConfig } from "@/lib/pages";
import { getStoreConfig } from "@/lib/store-config.server";

export const metadata: Metadata = {
  title: "Услуги — AGMERZ ESTATE",
  description:
    "Покупка, продажа, аренда и подбор недвижимости. AGMERZ ESTATE сопровождает клиентов на каждом этапе.",
};

export default async function ServicesPage() {
  const [config, pages] = await Promise.all([getStoreConfig(), getPagesConfig()]);
  const hero = pages.services;

  return (
    <>
      <ServicesHero
        brand={config.brand}
        logoUrl={config.logoUrl}
        title={hero.title}
        description={hero.description}
        imageUrl={hero.imageUrl || undefined}
      />
      <ServicesGrid />
      <FeaturedService />
      <HowWeWork />
      <WhyAgmerz />
      <ServicesCta />
      <ServicesFaq />
      <ServicesFinalCta />
    </>
  );
}
