"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/format";
import { getPropertyTypeLabel } from "@/lib/property-labels";
import type { Property } from "@/types";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminPropertyTableProps {
  properties: Property[];
  onDeleted: (id: string) => void;
}

export function AdminPropertyTable({ properties, onDeleted }: AdminPropertyTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/properties/${deleteTarget.id}`, { method: "DELETE" });
      if (!response.ok) return;
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (properties.length === 0) return null;

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted/60">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Фото</th>
              <th className="px-4 py-3 font-medium text-foreground">Объект</th>
              <th className="px-4 py-3 font-medium text-foreground">Тип</th>
              <th className="px-4 py-3 font-medium text-foreground">Район</th>
              <th className="px-4 py-3 font-medium text-foreground">Цена</th>
              <th className="px-4 py-3 font-medium text-foreground">Площадь</th>
              <th className="px-4 py-3 font-medium text-foreground">Статус</th>
              <th className="px-4 py-3 font-medium text-foreground">Дата</th>
              <th className="px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-surface-muted">
                    {property.images[0] && (
                      <Image src={property.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/properties/${property.id}`} className="font-medium text-foreground hover:text-accent">
                    {property.title}
                  </Link>
                  <p className="text-xs text-muted">ID {property.id}</p>
                </td>
                <td className="px-4 py-3 text-muted">{getPropertyTypeLabel(property.type)}</td>
                <td className="px-4 py-3 text-muted">{property.district}</td>
                <td className="px-4 py-3 text-muted">{formatPrice(property.price, property.currency)}</td>
                <td className="px-4 py-3 text-muted">{property.area} м²</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge kind="property" status={property.status} />
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(property.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      Редактировать
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600"
                      onClick={() => setDeleteTarget(property)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {properties.map((property) => (
          <article key={property.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex gap-4">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                {property.images[0] && (
                  <Image src={property.images[0]} alt="" fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/properties/${property.id}`} className="font-medium text-foreground">
                  {property.title}
                </Link>
                <p className="mt-1 text-sm text-muted">{formatPrice(property.price, property.currency)}</p>
                <p className="text-sm text-muted">
                  {getPropertyTypeLabel(property.type)} · {property.area} м²
                </p>
                <div className="mt-2">
                  <AdminStatusBadge kind="property" status={property.status} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/properties/${property.id}`}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm"
              >
                Редактировать
              </Link>
              <button
                type="button"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-red-600"
                onClick={() => setDeleteTarget(property)}
              >
                Удалить
              </button>
            </div>
          </article>
        ))}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить объект?"
        description={
          deleteTarget
            ? `Вы действительно хотите удалить «${deleteTarget.title}»? Действие нельзя отменить.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
