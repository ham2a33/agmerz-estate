"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  variant?: "sidebar" | "header";
}

export function LogoutButton({ className = "", variant = "header" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={`w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50 ${className}`}
      >
        {loading ? "Выход..." : "Выйти"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Выйти из панели управления"
      className={`rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-50 ${className}`}
    >
      {loading ? "Выход..." : "Logout"}
    </button>
  );
}
