import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutLocalExpertise } from "@/components/about/AboutLocalExpertise";
import { AboutServices } from "@/components/about/AboutServices";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutTrust } from "@/components/about/AboutTrust";
import { AboutFinalCta } from "@/components/about/AboutFinalCta";
import { getPagesConfig } from "@/lib/pages";
import { resolveImageSlot } from "@/lib/image-slots";
import { getStoreConfig } from "@/lib/store-config.server";

export const metadata: Metadata = {
  title: "О компании — AGMERZ ESTATE",
  description:
    "Узнайте больше об AGMERZ ESTATE, нашем подходе к недвижимости, локальной экспертизе и работе с клиентами.",
};

export default async function AboutPage() {
  const [config, pages, heroImage] = await Promise.all([
    getStoreConfig(),
    getPagesConfig(),
    resolveImageSlot("pages.about.hero"),
  ]);
  const hero = pages.about;

  return (
    <>
      <AboutHero
        brand={config.brand}
        logoUrl={config.logoUrl}
        city={config.address.city}
        title={hero.title}
        description={hero.description}
        imageUrl={heroImage.url || undefined}
      />
      <AboutStory />
      <AboutApproach />
      <AboutLocalExpertise />
      <AboutServices />
      <AboutExperience />
      <AboutTimeline />
      <AboutTrust />
      <AboutFinalCta />
    </>
  );
}
