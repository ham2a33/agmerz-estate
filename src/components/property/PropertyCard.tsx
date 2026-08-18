import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/format";
import { getPropertyStatusLabel, getPropertyTypeLabel } from "@/lib/property-labels";
import { FavoriteButton } from "./FavoriteButton";

interface PropertyCardProps {
  property: Property;
  showFavorite?: boolean;
}

export function PropertyCard({ property, showFavorite = true }: PropertyCardProps) {
  const image = property.images[0];
  const roomsLabel =
    property.rooms !== null ? `${property.rooms} ${property.rooms === 1 ? "комната" : property.rooms < 5 ? "комнаты" : "комнат"}` : null;

  return (
    <article className="group card-hover overflow-hidden rounded-2xl border border-border bg-surface">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover image-hover"
            />
          ) : (
            <div className="h-full w-full bg-surface-muted" />
          )}

          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {getPropertyTypeLabel(property.type)}
          </span>

          {property.status !== "active" && (
            <span className="absolute bottom-3 left-3 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-surface backdrop-blur-sm">
              {getPropertyStatusLabel(property.status)}
            </span>
          )}

          {showFavorite && (
            <div className="absolute right-3 top-3">
              <FavoriteButton propertyId={property.id} />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-accent">
            {property.title}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1113 0c0 4.8-6.5 10-6.5 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            {property.district}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            {roomsLabel && <span>{roomsLabel}</span>}
            {roomsLabel && <span className="text-border">•</span>}
            <span>{property.area} м²</span>
          </div>

          <p className="mt-4 text-xl font-medium text-foreground">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
