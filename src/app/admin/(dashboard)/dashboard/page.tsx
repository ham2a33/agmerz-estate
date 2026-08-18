import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCard";
import { AdminPropertyStatusBreakdown } from "@/components/admin/AdminPropertyStatusBreakdown";
import { AdminRecentRequests } from "@/components/admin/AdminRecentRequests";
import { AdminRecentProperties } from "@/components/admin/AdminRecentProperties";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import {
  getDashboardStats,
  getPropertyStatusBreakdown,
  getRecentProperties,
  getRecentRequests,
} from "@/lib/admin-dashboard";

export const metadata: Metadata = {
  title: "Dashboard — AGMERZ ADMIN",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const [stats, breakdown, recentProperties, recentRequests] = await Promise.all([
    getDashboardStats(),
    getPropertyStatusBreakdown(),
    getRecentProperties(),
    getRecentRequests(),
  ]);

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8 lg:space-y-8">
        <AdminStatCards stats={stats} />
        <AdminPropertyStatusBreakdown breakdown={breakdown} />
        <div className="grid gap-6 xl:grid-cols-2">
          <AdminRecentRequests requests={recentRequests} />
          <AdminRecentProperties properties={recentProperties} />
        </div>
        <AdminQuickActions />
      </div>
    </>
  );
}
