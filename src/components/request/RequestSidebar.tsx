import Image from "next/image";
import { resolveImageSlot } from "@/lib/image-slots";

const benefits = [
  "Проверенные объекты",
  "Персональный подбор",
  "Помощь на каждом этапе",
  "Сопровождение сделки",
];

export async function RequestSidebar() {
  const sidebarImage = await resolveImageSlot("pages.request.sidebar");

  return (
    <aside className="rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_48px_rgba(17,17,17,0.05)] md:p-8">
      {sidebarImage.url && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={sidebarImage.url}
            alt={sidebarImage.alt || "AGMERZ ESTATE"}
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
      )}

      <h2 className="mt-6 font-serif text-2xl text-foreground">Почему AGMERZ?</h2>
      <ul className="mt-5 space-y-3">
        {benefits.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-foreground md:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
