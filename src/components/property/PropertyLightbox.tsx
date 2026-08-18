"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface PropertyLightboxProps {
  images: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}

export function PropertyLightbox({ images, initialIndex, title, onClose }: PropertyLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-foreground/95 animate-fade-in-up">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <p className="text-sm text-surface/70">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-surface transition-colors hover:bg-surface/10"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-16">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Предыдущее фото"
          className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface/10 text-surface transition-colors hover:bg-surface/20 md:left-6 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="relative h-full w-full max-h-[70vh] max-w-5xl">
          <Image
            src={images[index]}
            alt={`${title} — фото ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Следующее фото"
          className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface/10 text-surface transition-colors hover:bg-surface/20 md:right-6 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="border-t border-surface/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl transition-all md:h-20 md:w-28 ${
                i === index ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
