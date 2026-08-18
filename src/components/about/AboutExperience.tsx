import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { aboutClientExperience, aboutTeam } from "@/lib/about-data";

export function AboutExperience() {
  return (
    <>
      <section className="section-padding">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="heading-section text-foreground">{aboutClientExperience.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {aboutClientExperience.description}
              </p>

              <ul className="mt-8 space-y-4">
                {aboutClientExperience.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-base text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
              <Image
                src={aboutClientExperience.image}
                alt="Клиентский опыт AGMERZ ESTATE"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding border-t border-border bg-surface-muted/50">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
              <Image
                src={aboutTeam.image}
                alt="Команда AGMERZ ESTATE"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="heading-section text-foreground">{aboutTeam.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {aboutTeam.description}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
