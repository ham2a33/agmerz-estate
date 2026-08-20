import { Container } from "@/components/layout/Container";
import { servicesOverview } from "@/lib/services-data";
import { resolveImageSlotMap, SERVICE_OVERVIEW_SLOT_MAP } from "@/lib/image-slots";
import { ServiceCard } from "./ServiceCard";

export async function ServicesGrid() {
  const slotIds = Object.values(SERVICE_OVERVIEW_SLOT_MAP);
  const images = await resolveImageSlotMap(slotIds);

  const services = servicesOverview.map((service) => {
    const slotId = SERVICE_OVERVIEW_SLOT_MAP[service.number];
    const image = slotId ? images[slotId] : undefined;
    return {
      ...service,
      image: image?.url || service.image,
      imageAlt: image?.alt || service.title,
    };
  });

  return (
    <section className="section-padding pb-0">
      <Container>
        <h2 className="heading-section text-foreground">Чем мы можем помочь</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
