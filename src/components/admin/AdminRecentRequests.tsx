import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getRequestTypeLabel } from "@/lib/admin-labels";
import type { Request } from "@/types";
import { AdminStatusBadge } from "./AdminStatusBadge";

interface AdminRecentRequestsProps {
  requests: Request[];
}

export function AdminRecentRequests({ requests }: AdminRecentRequestsProps) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-medium text-foreground">Последние заявки</h2>
        <Link href="/admin/requests" className="text-sm text-muted transition-colors hover:text-foreground">
          Все заявки
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted">Пока нет новых заявок</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/50">
              <tr>
                <th className="px-5 py-3 font-medium text-foreground">Имя</th>
                <th className="px-5 py-3 font-medium text-foreground">Телефон</th>
                <th className="px-5 py-3 font-medium text-foreground">Тип</th>
                <th className="px-5 py-3 font-medium text-foreground">Статус</th>
                <th className="px-5 py-3 font-medium text-foreground">Дата</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-foreground">{request.name}</td>
                  <td className="px-5 py-3 text-muted">{request.phone}</td>
                  <td className="px-5 py-3 text-muted">{getRequestTypeLabel(request.type)}</td>
                  <td className="px-5 py-3">
                    <AdminStatusBadge kind="request" status={request.status} />
                  </td>
                  <td className="px-5 py-3 text-muted">{formatDate(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
