import type { PropertyStatus } from "@/types";
import { getAdminPropertyStatusLabel } from "@/lib/admin-labels";

interface AdminPropertyStatusBreakdownProps {
  breakdown: { status: PropertyStatus; count: number }[];
}

export function AdminPropertyStatusBreakdown({ breakdown }: AdminPropertyStatusBreakdownProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">Статусы объектов</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {breakdown.map((item) => (
          <div key={item.status} className="rounded-lg border border-border bg-surface-muted/40 px-4 py-3">
            <p className="text-xs text-muted">{getAdminPropertyStatusLabel(item.status)}</p>
            <p className="mt-1 text-xl font-medium text-foreground">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
