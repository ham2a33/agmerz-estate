import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getPropertyTypeLabel } from "@/lib/property-labels";
import type { Property } from "@/types";
import { AdminStatusBadge } from "./AdminStatusBadge";

interface AdminRecentPropertiesProps {
  properties: Property[];
}

export function AdminRecentProperties({ properties }: AdminRecentPropertiesProps) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-medium text-foreground">Последние объекты</h2>
        <Link href="/admin/properties" className="text-sm text-muted transition-colors hover:text-foreground">
          Все объекты
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted">Объекты не найдены</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/50">
              <tr>
                <th className="px-5 py-3 font-medium text-foreground">Фото</th>
                <th className="px-5 py-3 font-medium text-foreground">Название</th>
                <th className="px-5 py-3 font-medium text-foreground">Тип</th>
                <th className="px-5 py-3 font-medium text-foreground">Цена</th>
                <th className="px-5 py-3 font-medium text-foreground">Статус</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-surface-muted">
                      {property.images[0] && (
                        <Image
                          src={property.images[0]}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {property.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted">{getPropertyTypeLabel(property.type)}</td>
                  <td className="px-5 py-3 text-muted">
                    {formatPrice(property.price, property.currency)}
                  </td>
                  <td className="px-5 py-3">
                    <AdminStatusBadge kind="property" status={property.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
