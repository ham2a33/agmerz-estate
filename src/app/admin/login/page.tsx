import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAuthenticatedServer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход — AGMERZ ADMIN",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  if (await isAuthenticatedServer()) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm md:p-10">
        <div className="text-center">
          <p className="font-serif text-2xl text-foreground">AGMERZ</p>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Estate</p>
          <h1 className="mt-6 text-xl font-medium text-foreground">Вход в панель управления</h1>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
