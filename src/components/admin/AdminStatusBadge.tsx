import type { ClientStatus, PropertyStatus, RequestStatus } from "@/types";
import {
  getAdminPropertyStatusLabel,
  getClientStatusLabel,
  getRequestStatusLabel,
} from "@/lib/admin-labels";

interface AdminStatusBadgeProps {
  kind: "property" | "request" | "client";
  status: PropertyStatus | RequestStatus | ClientStatus;
}

const propertyStyles: Record<PropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-700 border-amber-200",
  sold: "bg-surface-muted text-muted border-border",
  rented: "bg-blue-50 text-blue-700 border-blue-200",
  draft: "bg-surface-muted text-muted border-border",
};

const requestStyles: Record<RequestStatus, string> = {
  new: "bg-accent/10 text-accent border-accent/20",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-surface-muted text-muted border-border",
};

const clientStyles: Record<ClientStatus, string> = {
  new: "bg-accent/10 text-accent border-accent/20",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  inactive: "bg-surface-muted text-muted border-border",
};

export function AdminStatusBadge({ kind, status }: AdminStatusBadgeProps) {
  if (kind === "client") {
    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${clientStyles[status as ClientStatus]}`}
      >
        {getClientStatusLabel(status as ClientStatus)}
      </span>
    );
  }

  const label =
    kind === "property"
      ? getAdminPropertyStatusLabel(status as PropertyStatus)
      : getRequestStatusLabel(status as RequestStatus);

  const styles =
    kind === "property"
      ? propertyStyles[status as PropertyStatus]
      : requestStyles[status as RequestStatus];

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
