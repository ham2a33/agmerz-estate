"use client";

import { useState } from "react";

interface PropertyDescriptionProps {
  description: string;
}

const COLLAPSE_LENGTH = 280;

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  const isLong = description.length > COLLAPSE_LENGTH;
  const visibleText =
    isLong && !expanded ? `${description.slice(0, COLLAPSE_LENGTH).trim()}…` : description;

  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Об объекте</h2>
      <div className="mt-5 max-w-3xl">
        <p className="whitespace-pre-line text-base leading-relaxed text-muted md:text-lg">
          {visibleText}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-4 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>
    </section>
  );
}
