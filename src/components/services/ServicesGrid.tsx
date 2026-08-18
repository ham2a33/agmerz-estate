import { Container } from "@/components/layout/Container";
import { servicesOverview } from "@/lib/services-data";
import { ServiceCard } from "./ServiceCard";

export function ServicesGrid() {
  return (
    <section className="section-padding pb-0">
      <Container>
        <h2 className="heading-section text-foreground">Чем мы можем помочь</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {servicesOverview.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
