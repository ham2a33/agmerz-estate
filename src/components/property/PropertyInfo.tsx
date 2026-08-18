import type { Property } from "@/types";
import { formatPrice } from "@/lib/format";
import { getPricePerSqm, isRental } from "@/lib/property-helpers";
import type { StoreConfig } from "@/lib/store-config.types";
import { FavoriteButton } from "./FavoriteButton";
import { PropertyShareButton } from "./PropertyShareButton";
import { LinkButton } from "@/components/ui/Button";

interface PropertyInfoProps {
  property: Property;
  shareUrl: string;
  config: StoreConfig;
}

export function PropertyInfo({ property, shareUrl, config }: PropertyInfoProps) {
  const pricePerSqm = getPricePerSqm(property);
  const rental = isRental(property);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <p className="font-serif text-3xl font-medium text-foreground md:text-4xl">
        {formatPrice(property.price, property.currency)}
        {rental && (
          <span className="ml-1 text-lg font-normal text-muted md:text-xl">/ месяц</span>
        )}
      </p>

      {!rental && pricePerSqm !== null && (
        <p className="mt-2 text-sm text-muted">
          ≈ {formatPrice(pricePerSqm, property.currency)} / м²
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <FavoriteButton propertyId={property.id} showLabel />
        <PropertyShareButton title={property.title} url={shareUrl} />
      </div>

      <div className="mt-6 space-y-3 border-t border-border pt-6">
        <h3 className="font-serif text-xl text-foreground">Хотите посмотреть объект?</h3>
        <p className="text-sm leading-relaxed text-muted">
          Оставьте заявку, и наш специалист свяжется с вами, чтобы согласовать удобное время
          просмотра.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <a
          href="#viewing-form"
          className="inline-flex items-center justify-center rounded-2xl bg-foreground px-6 py-3.5 text-sm font-medium text-surface transition-colors hover:bg-foreground/90"
        >
          Записаться на просмотр
        </a>
        <LinkButton href={config.phone.href} variant="outline" className="w-full justify-center">
          Позвонить
        </LinkButton>
        <LinkButton href={config.whatsapp.href} variant="outline" className="w-full justify-center">
          WhatsApp
        </LinkButton>
      </div>
    </div>
  );
}
