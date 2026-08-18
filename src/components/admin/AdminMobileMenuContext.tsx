"use client";

import { createContext, useContext } from "react";

interface AdminMobileMenuContextValue {
  openMenu: () => void;
}

const AdminMobileMenuContext = createContext<AdminMobileMenuContextValue | null>(null);

export function AdminMobileMenuProvider({
  openMenu,
  children,
}: {
  openMenu: () => void;
  children: React.ReactNode;
}) {
  return (
    <AdminMobileMenuContext.Provider value={{ openMenu }}>
      {children}
    </AdminMobileMenuContext.Provider>
  );
}

export function useAdminMobileMenu() {
  const context = useContext(AdminMobileMenuContext);
  return context;
}
