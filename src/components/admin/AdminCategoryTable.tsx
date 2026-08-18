"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCategoryImageUrl } from "@/lib/category-image-fallback";
import { getCategoryStatusLabel } from "@/lib/admin-labels";
import type { AdminCategoryListItem } from "@/lib/categories";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminCategoryTableProps {
  categories: AdminCategoryListItem[];
  onDeleted: (id: string) => void;
}

export function AdminCategoryTable({ categories, onDeleted }: AdminCategoryTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<AdminCategoryListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
      const data = await response.json();

      if (response.status === 409) {
        setDeleteError("Категория используется объектами недвижимости и не может быть удалена.");
        return;
      }

      if (!response.ok || !data.success) return;

      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (categories.length === 0) return null;

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted/60">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Название</th>
              <th className="px-4 py-3 font-medium text-foreground">Slug</th>
              <th className="px-4 py-3 font-medium text-foreground">Объекты</th>
              <th className="px-4 py-3 font-medium text-foreground">Статус</th>
              <th className="px-4 py-3 font-medium text-foreground">Порядок</th>
              <th className="px-4 py-3 font-medium text-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                      <Image
                        src={getCategoryImageUrl(category)}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{category.slug}</td>
                <td className="px-4 py-3 text-muted">{category.propertyCount}</td>
                <td className="px-4 py-3 text-muted">{getCategoryStatusLabel(category.isActive)}</td>
                <td className="px-4 py-3 text-muted">{category.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      Редактировать
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600"
                      onClick={() => {
                        setDeleteError("");
                        setDeleteTarget(category);
                      }}
                      disabled={category.inUse}
                      title={
                        category.inUse
                          ? "Категория используется объектами недвижимости"
                          : undefined
                      }
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
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                  <Image
                    src={getCategoryImageUrl(category)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link href={`/admin/categories/${category.id}`} className="font-medium text-foreground">
                    {category.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{category.slug}</p>
                  <p className="mt-1 text-sm text-muted">
                  Объектов: {category.propertyCount} · Порядок: {category.sortOrder}
                </p>
                </div>
              </div>
              <span className="text-xs text-muted">{getCategoryStatusLabel(category.isActive)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/categories/${category.id}`}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm"
              >
                Редактировать
              </Link>
              <button
                type="button"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                onClick={() => {
                  setDeleteError("");
                  setDeleteTarget(category);
                }}
                disabled={category.inUse}
              >
                Удалить
              </button>
            </div>
          </article>
        ))}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить категорию?"
        description={
          deleteTarget
            ? deleteError ||
              `Вы действительно хотите удалить категорию «${deleteTarget.name}»?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError("");
        }}
        loading={deleting}
      />
    </>
  );
}
