"use client";

import { createContext, useContext } from "react";
import { DEFAULT_STORE_CONFIG, type StoreConfig } from "@/lib/store-config.types";

const SiteConfigContext = createContext<StoreConfig>(DEFAULT_STORE_CONFIG);

interface SiteConfigProviderProps {
  config: StoreConfig;
  children: React.ReactNode;
}

export function SiteConfigProvider({ config, children }: SiteConfigProviderProps) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useStoreConfig(): StoreConfig {
  return useContext(SiteConfigContext);
}
