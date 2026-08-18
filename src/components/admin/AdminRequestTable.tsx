"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { getRequestTypeLabel } from "@/lib/admin-labels";
import { getEmailHref, getPhoneHref } from "@/lib/contact-helpers";
import type { Request } from "@/types";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminRequestTableProps {
  requests: Request[];
  onDeleted: (id: string) => void;
}

export function AdminRequestTable({ requests, onDeleted }: AdminRequestTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Request | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/requests/${deleteTarget.id}`, { method: "DELETE" });
      if (!response.ok) return;
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (requests.length === 0) return null;

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted/60">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Имя</th>
              <th className="px-4 py-3 font-medium text-foreground">Телефон</th>
              <th className="px-4 py-3 font-medium text-foreground">Email</th>
              <th className="px-4 py-3 font-medium text-foreground">Тип</th>
              <th className="px-4 py-3 font-medium text-foreground">Статус</th>
              <th className="px-4 py-3 font-medium text-foreground">Дата</th>
              <th className="px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {request.name}
                  </Link>
                  <p className="text-xs text-muted">ID {request.id}</p>
                </td>
                <td className="px-4 py-3">
                  <a href={getPhoneHref(request.phone)} className="text-muted hover:text-foreground">
                    {request.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {request.email ? (
                    <a href={getEmailHref(request.email)} className="text-muted hover:text-foreground">
                      {request.email}
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{getRequestTypeLabel(request.type)}</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge kind="request" status={request.status} />
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(request.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/requests/${request.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      Открыть
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600"
                      onClick={() => setDeleteTarget(request)}
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
        {requests.map((request) => (
          <article key={request.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/admin/requests/${request.id}`} className="font-medium text-foreground">
                  {request.name}
                </Link>
                <p className="mt-1 text-sm text-muted">{getRequestTypeLabel(request.type)}</p>
                <p className="mt-1 text-sm text-muted">{formatDate(request.createdAt)}</p>
              </div>
              <AdminStatusBadge kind="request" status={request.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <a href={getPhoneHref(request.phone)} className="block text-foreground">
                {request.phone}
              </a>
              {request.email && (
                <a href={getEmailHref(request.email)} className="block text-muted">
                  {request.email}
                </a>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/requests/${request.id}`}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm"
              >
                Открыть
              </Link>
              <button
                type="button"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-red-600"
                onClick={() => setDeleteTarget(request)}
              >
                Удалить
              </button>
            </div>
          </article>
        ))}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить заявку?"
        description={
          deleteTarget
            ? `Вы действительно хотите удалить заявку от «${deleteTarget.name}»? Действие нельзя отменить.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
