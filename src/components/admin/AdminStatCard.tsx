import Link from "next/link";
import type { DashboardStats } from "@/lib/admin-dashboard";

interface AdminStatCardProps {
  label: string;
  value: number;
  href: string;
}

function StatCard({ label, value, href }: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-muted/60"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-foreground">{value}</p>
    </Link>
  );
}

interface AdminStatCardsProps {
  stats: DashboardStats;
}

export function AdminStatCards({ stats }: AdminStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      <StatCard label="Всего объектов" value={stats.properties} href="/admin/properties" />
      <StatCard label="Активные объекты" value={stats.activeProperties} href="/admin/properties" />
      <StatCard label="Всего заявок" value={stats.requests} href="/admin/requests" />
      <StatCard label="Новые заявки" value={stats.newRequests} href="/admin/requests" />
      <StatCard label="Всего клиентов" value={stats.clients} href="/admin/clients" />
      <StatCard label="Активные клиенты" value={stats.activeClients} href="/admin/clients" />
      <StatCard label="Всего категорий" value={stats.categories} href="/admin/categories" />
    </div>
  );
}
