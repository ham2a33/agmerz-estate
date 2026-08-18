"use client";

import { ViewingForm } from "@/components/forms/ViewingForm";

interface ViewingRequestProps {
  propertyId: string;
  propertyTitle: string;
}

export function ViewingRequest({ propertyId, propertyTitle }: ViewingRequestProps) {
  return (
    <section id="viewing-form" className="scroll-mt-28 rounded-3xl border border-border bg-surface p-6 md:p-8">
      <h2 className="font-serif text-xl text-foreground md:text-2xl">Запись на просмотр</h2>
      <p className="mt-2 text-sm text-muted">{propertyTitle}</p>
      <div className="mt-6">
        <ViewingForm propertyId={propertyId} propertyTitle={propertyTitle} />
      </div>
    </section>
  );
}
