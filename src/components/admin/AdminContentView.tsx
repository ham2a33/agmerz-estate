"use client";

import { useState } from "react";
import type { PageHeroConfig, PageKey, PagesConfig } from "@/types/pages";
import { PAGE_KEYS, PAGE_LABELS } from "@/types/pages";
import { Button } from "@/components/ui/Button";
import { AdminPageHeroEditor } from "./AdminPageHeroEditor";

interface AdminContentViewProps {
  initialConfig: PagesConfig;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminContentView({ initialConfig }: AdminContentViewProps) {
  const [config, setConfig] = useState(initialConfig);
  const [activePage, setActivePage] = useState<PageKey>("catalog");
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updatePage(pageKey: PageKey, value: PageHeroConfig) {
    setConfig((current) => ({
      ...current,
      [pageKey]: value,
    }));
    setSaved(false);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSaved(false);

    try {
      const response = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [activePage]: config[activePage] }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить изменения.");
        return;
      }

      setConfig(data.data.config);
      setSaved(true);
    } catch {
      setSubmitError("Не удалось сохранить изменения.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 md:px-6 md:py-8"
    >
      <div>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Контент сайта</h2>
        <p className="mt-2 text-sm text-muted">
          Hero-изображения, заголовки и описания публичных страниц
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PAGE_KEYS.map((pageKey) => (
          <button
            key={pageKey}
            type="button"
            onClick={() => {
              setActivePage(pageKey);
              setSaved(false);
              setSubmitError("");
            }}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              activePage === pageKey
                ? "border-foreground bg-surface-muted font-medium text-foreground"
                : "border-border text-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            {PAGE_LABELS[pageKey]}
          </button>
        ))}
      </div>

      <Section title={PAGE_LABELS[activePage]}>
        <AdminPageHeroEditor
          pageLabel={PAGE_LABELS[activePage]}
          value={config[activePage]}
          onChange={(value) => updatePage(activePage, value)}
        />
      </Section>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Button type="submit" variant="dark" disabled={submitting}>
          {submitting ? "Сохранение..." : "Сохранить"}
        </Button>
        {saved && <p className="mt-3 text-sm text-emerald-700">Сохранено</p>}
        {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
      </div>
    </form>
  );
}
