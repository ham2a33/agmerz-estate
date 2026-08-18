"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { HomepageConfig } from "@/types/homepage";
import type { Property } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadButton } from "./ImageUploadButton";

interface AdminHomepageViewProps {
  initialConfig: HomepageConfig;
  initialFeaturedProperties: Property[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminHomepageView({
  initialConfig,
  initialFeaturedProperties,
}: AdminHomepageViewProps) {
  const [config, setConfig] = useState(initialConfig);
  const [featuredProperties, setFeaturedProperties] = useState(initialFeaturedProperties);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [featuredBusy, setFeaturedBusy] = useState(false);

  const featuredIds = useMemo(
    () => new Set(featuredProperties.map((property) => property.id)),
    [featuredProperties],
  );

  const filteredAvailable = useMemo(() => {
    const query = propertySearch.trim().toLowerCase();
    return availableProperties.filter((property) => {
      if (featuredIds.has(property.id)) return false;
      if (!query) return true;
      return (
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query)
      );
    });
  }, [availableProperties, featuredIds, propertySearch]);

  function updateHeroField<K extends keyof HomepageConfig["hero"]>(
    key: K,
    value: HomepageConfig["hero"][K],
  ) {
    setConfig((current) => ({
      ...current,
      hero: { ...current.hero, [key]: value },
    }));
    setSaved(false);
  }

  function updateContactField<K extends keyof HomepageConfig["contactCta"]>(
    key: K,
    value: HomepageConfig["contactCta"][K],
  ) {
    setConfig((current) => ({
      ...current,
      contactCta: { ...current.contactCta, [key]: value },
    }));
    setSaved(false);
  }

  function updateSectionImage(key: keyof HomepageConfig["sectionImages"], value: string) {
    setConfig((current) => ({
      ...current,
      sectionImages: { ...current.sectionImages, [key]: value },
    }));
    setSaved(false);
  }

  async function handleSaveConfig(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSaved(false);

    try {
      const response = await fetch("/api/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: config.hero,
          contactCta: config.contactCta,
          sectionImages: config.sectionImages,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить настройки главной.");
        return;
      }

      setConfig(data.data.config);
      setSaved(true);
    } catch {
      setSubmitError("Не удалось сохранить настройки главной.");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadAvailableProperties() {
    if (availableProperties.length > 0) return;
    setLoadingProperties(true);

    try {
      const response = await fetch("/api/properties");
      const data = await response.json();
      if (response.ok && data.success) {
        setAvailableProperties(data.data);
      }
    } finally {
      setLoadingProperties(false);
    }
  }

  async function reorderFeatured(fromIndex: number, direction: -1 | 1) {
    const targetIndex = fromIndex + direction;
    if (targetIndex < 0 || targetIndex >= featuredProperties.length) return;

    const next = [...featuredProperties];
    [next[fromIndex], next[targetIndex]] = [next[targetIndex], next[fromIndex]];
    setFeaturedProperties(next);
    setFeaturedBusy(true);

    try {
      const response = await fetch("/api/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featuredOrder: { propertyIds: next.map((property) => property.id) },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFeaturedProperties(data.data.featuredProperties);
      }
    } finally {
      setFeaturedBusy(false);
    }
  }

  async function addFeaturedProperty(propertyId: string) {
    setFeaturedBusy(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}/cms`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: true }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) return;

      setFeaturedProperties((current) => [...current, data.data]);
      setPropertySearch("");
    } finally {
      setFeaturedBusy(false);
    }
  }

  async function removeFeaturedProperty(propertyId: string) {
    setFeaturedBusy(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}/cms`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: false }),
      });

      if (!response.ok) return;

      setFeaturedProperties((current) =>
        current.filter((property) => property.id !== propertyId),
      );
    } finally {
      setFeaturedBusy(false);
    }
  }

  const sectionImageFields: Array<{
    key: keyof HomepageConfig["sectionImages"];
    label: string;
  }> = [
    { key: "homepageHero", label: "Hero главной страницы" },
    { key: "requestHero", label: "Hero страницы заявки" },
    { key: "contactHero", label: "Hero страницы контактов" },
  ];

  return (
    <form
      onSubmit={handleSaveConfig}
      className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 md:px-6 md:py-8"
    >
      <div>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Главная страница</h2>
        <p className="mt-2 text-sm text-muted">Контент и блоки на главной</p>
      </div>

      <Section title="Hero-блок">
        <Input
          label="Заголовок"
          value={config.hero.title}
          onChange={(event) => updateHeroField("title", event.target.value)}
        />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Подзаголовок</span>
          <textarea
            value={config.hero.subtitle}
            onChange={(event) => updateHeroField("subtitle", event.target.value)}
            rows={3}
            className="rounded-lg border border-border bg-surface px-4 py-3"
          />
        </label>
        {config.hero.imageUrl && (
          <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded-lg bg-surface-muted">
            <Image
              src={config.hero.imageUrl}
              alt="Hero"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
        )}
        <Input
          label="URL изображения"
          value={config.hero.imageUrl}
          onChange={(event) => updateHeroField("imageUrl", event.target.value)}
        />
        <ImageUploadButton
          label="Загрузить изображение"
          onUploaded={(url) => updateHeroField("imageUrl", url)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Текст кнопки"
            value={config.hero.ctaText}
            onChange={(event) => updateHeroField("ctaText", event.target.value)}
          />
          <Input
            label="Ссылка кнопки"
            value={config.hero.ctaLink}
            onChange={(event) => updateHeroField("ctaLink", event.target.value)}
          />
        </div>
      </Section>

      <Section title="Избранные объекты">
        {featuredProperties.length === 0 ? (
          <p className="text-sm text-muted">Избранных объектов пока нет.</p>
        ) : (
          <div className="space-y-3">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="flex flex-col gap-3 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="text-sm font-medium text-foreground hover:text-accent"
                  >
                    {property.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{property.address}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    onClick={() => reorderFeatured(index, -1)}
                    disabled={index === 0 || featuredBusy}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    onClick={() => reorderFeatured(index, 1)}
                    disabled={index === featuredProperties.length - 1 || featuredBusy}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-3 py-1 text-xs text-red-600"
                    onClick={() => removeFeaturedProperty(property.id)}
                    disabled={featuredBusy}
                  >
                    Убрать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-dashed border-border p-4">
          <Input
            label="Добавить объект"
            value={propertySearch}
            onChange={(event) => setPropertySearch(event.target.value)}
            onFocus={loadAvailableProperties}
            placeholder="Поиск по названию или адресу..."
          />
          {loadingProperties && <p className="mt-2 text-sm text-muted">Загрузка объектов...</p>}
          {!loadingProperties && filteredAvailable.length > 0 && (
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {filteredAvailable.slice(0, 8).map((property) => (
                <li key={property.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-surface-muted/40"
                    onClick={() => addFeaturedProperty(property.id)}
                    disabled={featuredBusy}
                  >
                    <span>{property.title}</span>
                    <span className="text-xs text-muted">+ Добавить</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section title="Изображения секций">
        {sectionImageFields.map(({ key, label }) => (
          <div key={key} className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {config.sectionImages[key] && (
              <div className="relative aspect-[16/9] max-w-xs overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={config.sectionImages[key]}
                  alt={label}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            )}
            <Input
              label="URL"
              value={config.sectionImages[key]}
              onChange={(event) => updateSectionImage(key, event.target.value)}
            />
            <ImageUploadButton
              label="Загрузить"
              onUploaded={(url) => updateSectionImage(key, url)}
            />
          </div>
        ))}
      </Section>

      <Section title="Контактный CTA">
        <Input
          label="Заголовок"
          value={config.contactCta.title}
          onChange={(event) => updateContactField("title", event.target.value)}
        />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Текст</span>
          <textarea
            value={config.contactCta.text}
            onChange={(event) => updateContactField("text", event.target.value)}
            rows={3}
            className="rounded-lg border border-border bg-surface px-4 py-3"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Текст кнопки"
            value={config.contactCta.buttonText}
            onChange={(event) => updateContactField("buttonText", event.target.value)}
          />
          <Input
            label="Ссылка кнопки"
            value={config.contactCta.buttonLink}
            onChange={(event) => updateContactField("buttonLink", event.target.value)}
          />
        </div>
      </Section>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Button type="submit" variant="dark" disabled={submitting}>
          {submitting ? "Сохранение..." : "Сохранить изменения"}
        </Button>
        {saved && <p className="mt-3 text-sm text-emerald-700">Сохранено</p>}
        {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
      </div>
    </form>
  );
}
