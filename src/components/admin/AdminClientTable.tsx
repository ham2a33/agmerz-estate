"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { getClientTypeLabel } from "@/lib/admin-labels";
import {
  getClientFullName,
  getEmailHref,
  getPhoneHref,
} from "@/lib/contact-helpers";
import type { AdminClientListItem } from "@/lib/clients.types";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminClientTableProps {
  clients: AdminClientListItem[];
  onDeleted: (id: string) => void;
}

export function AdminClientTable({ clients, onDeleted }: AdminClientTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<AdminClientListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" });
      if (!response.ok) return;
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (clients.length === 0) return null;

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
              <th className="px-4 py-3 font-medium text-foreground">Заявки</th>
              <th className="px-4 py-3 font-medium text-foreground">Активность</th>
              <th className="px-4 py-3 font-medium text-foreground">Статус</th>
              <th className="px-4 py-3 font-medium text-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {getClientFullName(client)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <a href={getPhoneHref(client.phone)} className="text-muted hover:text-foreground">
                      {client.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {client.email ? (
                      <a href={getEmailHref(client.email)} className="text-muted hover:text-foreground">
                        {client.email}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{getClientTypeLabel(client.type)}</td>
                  <td className="px-4 py-3 text-muted">{client.requestCount}</td>
                  <td className="px-4 py-3 text-muted">
                    {client.lastActivity ? formatDate(client.lastActivity) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge kind="client" status={client.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                      >
                        Открыть
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600"
                        onClick={() => setDeleteTarget(client)}
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
        {clients.map((client) => (
            <article key={client.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/clients/${client.id}`} className="font-medium text-foreground">
                    {getClientFullName(client)}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{getClientTypeLabel(client.type)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {client.lastActivity ? formatDate(client.lastActivity) : "—"}
                  </p>
                </div>
                <AdminStatusBadge kind="client" status={client.status} />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <a href={getPhoneHref(client.phone)} className="block text-foreground">
                  {client.phone}
                </a>
                {client.email && (
                  <a href={getEmailHref(client.email)} className="block text-muted">
                    {client.email}
                  </a>
                )}
                <p className="text-muted">Заявок: {client.requestCount}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm"
                >
                  Открыть
                </Link>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-red-600"
                  onClick={() => setDeleteTarget(client)}
                >
                  Удалить
                </button>
              </div>
            </article>
        ))}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить клиента?"
        description={
          deleteTarget
            ? `Вы действительно хотите удалить клиента «${getClientFullName(deleteTarget)}»? Связанные заявки останутся в системе.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
