import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PropertyRequestForm } from "@/components/forms/PropertyRequestForm";
import { RequestHero } from "@/components/request/RequestHero";
import { RequestSidebar } from "@/components/request/RequestSidebar";
import { getStoreConfig } from "@/lib/store-config.server";
import { getHomepageConfig } from "@/lib/homepage";

export const metadata: Metadata = {
  title: "Найти недвижимость — AGMERZ ESTATE",
  description:
    "Расскажите, какую недвижимость вы ищете — AGMERZ ESTATE подберёт подходящие варианты под ваши требования.",
};

export default async function RequestPage() {
  const [config, homepage] = await Promise.all([getStoreConfig(), getHomepageConfig()]);

  return (
    <>
      <RequestHero
        logoUrl={config.logoUrl}
        heroImageUrl={homepage.sectionImages.requestHero}
      />

      <section className="section-padding bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_340px]">
            <PropertyRequestForm />

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <RequestSidebar />
              </div>
            </div>
          </div>

          <div className="mt-10 lg:hidden">
            <RequestSidebar />
          </div>
        </Container>
      </section>
    </>
  );
}
