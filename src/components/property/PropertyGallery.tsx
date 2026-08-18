"use client";

import { useState } from "react";
import Image from "next/image";
import { PropertyLightbox } from "./PropertyLightbox";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return <div className="aspect-[16/10] rounded-3xl bg-surface-muted md:aspect-[21/9]" />;
  }

  const mainImage = images[activeIndex] ?? images[0];
  const sideImages = images.filter((_, i) => i !== activeIndex).slice(0, 2);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      {/* Desktop grid gallery */}
      <div className="hidden gap-3 md:grid md:grid-cols-[1fr_240px] md:grid-rows-2 lg:grid-cols-[1fr_280px] lg:gap-4">
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="group relative row-span-2 overflow-hidden rounded-3xl bg-surface-muted"
        >
          <div className="relative aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[480px]">
            <Image
              src={mainImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </button>

        {sideImages.map((img, i) => {
          const originalIndex = images.indexOf(img);
          return (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => openLightbox(originalIndex)}
              className="group relative overflow-hidden rounded-3xl bg-surface-muted"
            >
              <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[232px]">
                <Image
                  src={img}
                  alt={`${title} — фото ${originalIndex + 1}`}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </button>
          );
        })}

        {sideImages.length < 2 &&
          Array.from({ length: 2 - sideImages.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className="rounded-3xl bg-surface-muted" />
          ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-surface-muted"
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-foreground/70 px-3 py-1 text-xs font-medium text-surface backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        </button>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                  i === activeIndex ? "ring-2 ring-accent" : "opacity-70"
                }`}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <PropertyLightbox
          images={images}
          initialIndex={activeIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
