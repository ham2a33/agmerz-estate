"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { servicesFaq } from "@/lib/services-data";

export function ServicesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding border-t border-border pt-12 md:pt-16">
      <Container>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Частые вопросы</h2>
        <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-surface">
          {servicesFaq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-muted/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-foreground">{item.question}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-muted">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
