"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminMobileMenuProvider } from "./AdminMobileMenuContext";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobile();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <AdminMobileMenuProvider openMenu={openMobile}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar mobileOpen={mobileOpen} onClose={closeMobile} />

        {mobileOpen && (
          <button
            type="button"
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
            onClick={closeMobile}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </AdminMobileMenuProvider>
  );
}
