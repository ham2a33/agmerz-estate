"use client";

import { LinkButton } from "@/components/ui/Button";
import { useStoreConfig } from "@/components/layout/SiteConfigProvider";

export function PropertyMobileBar() {
  const config = useStoreConfig();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <LinkButton href={config.whatsapp.href} variant="outline" className="flex-1 justify-center py-3">
          WhatsApp
        </LinkButton>
        <a
          href="#viewing-form"
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-surface transition-colors hover:bg-foreground/90"
        >
          Записаться
        </a>
      </div>
    </div>
  );
}
