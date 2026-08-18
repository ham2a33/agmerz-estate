"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getRequestStatusLabel } from "@/lib/admin-labels";
import {
  settingsToFormValues,
  validateSettingsForm,
  type SettingsFormValues,
} from "@/lib/settings-admin-form";
import type { RequestStatus, SiteSettings } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";

const REQUEST_STATUS_OPTIONS: RequestStatus[] = ["new", "in_progress", "completed", "cancelled"];

interface AdminSettingsFormProps {
  initialSettings: SiteSettings;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsFormValues>(settingsToFormValues(initialSettings));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField<K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateSettingsForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить настройки.");
        return;
      }

      setValues(settingsToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить настройки.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[900px] space-y-6 px-4 py-6 md:px-6 md:py-8"
    >
      <div>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Настройки</h2>
        <p className="mt-2 text-sm text-muted">Основные параметры агентства и сайта</p>
      </div>

      <Section title="Брендинг" description="Логотип и favicon для публичного сайта">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Логотип</p>
            {values.logoUrl && (
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-surface-muted">
                <Image
                  src={values.logoUrl}
                  alt="Логотип"
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
            )}
            <Input
              label="URL логотипа"
              value={values.logoUrl}
              onChange={(event) => updateField("logoUrl", event.target.value)}
            />
            <ImageUploadButton
              label="Загрузить логотип"
              onUploaded={(url) => updateField("logoUrl", url)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Favicon</p>
            {values.faviconUrl && (
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-surface-muted">
                <Image
                  src={values.faviconUrl}
                  alt="Favicon"
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
            )}
            <Input
              label="URL favicon"
              value={values.faviconUrl}
              onChange={(event) => updateField("faviconUrl", event.target.value)}
            />
            <ImageUploadButton
              label="Загрузить favicon"
              onUploaded={(url) => updateField("faviconUrl", url)}
            />
          </div>
        </div>
      </Section>

      <Section title="Основные настройки">
        <Input
          label="Название агентства *"
          value={values.agencyName}
          onChange={(event) => updateField("agencyName", event.target.value)}
        />
        {errors.agencyName && <p className="text-sm text-red-600">{errors.agencyName}</p>}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Короткое описание</span>
          <textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={3}
            className="rounded-lg border border-border bg-surface px-4 py-3"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Телефон" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} />
          <Input label="WhatsApp" value={values.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} />
          <Input label="Email" type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} />
          <Input label="Город" value={values.city} onChange={(event) => updateField("city", event.target.value)} />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        <Input label="Адрес" value={values.address} onChange={(event) => updateField("address", event.target.value)} />
        <Input label="Рабочие часы" value={values.workingHours} onChange={(event) => updateField("workingHours", event.target.value)} />
      </Section>

      <Section title="Социальные сети" description="Все поля необязательные">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Instagram" value={values.instagram} onChange={(event) => updateField("instagram", event.target.value)} />
          <Input label="Telegram" value={values.telegram} onChange={(event) => updateField("telegram", event.target.value)} />
          <Input label="TikTok" value={values.tiktok} onChange={(event) => updateField("tiktok", event.target.value)} />
          <Input label="Facebook" value={values.facebook} onChange={(event) => updateField("facebook", event.target.value)} />
        </div>
      </Section>

      <Section title="Настройки сайта">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Название сайта" value={values.siteTitle} onChange={(event) => updateField("siteTitle", event.target.value)} />
          <Input label="Meta title" value={values.metaTitle} onChange={(event) => updateField("metaTitle", event.target.value)} />
          <Input label="Язык сайта" value={values.language} onChange={(event) => updateField("language", event.target.value)} />
          <Input label="Валюта" value={values.currency} onChange={(event) => updateField("currency", event.target.value)} />
        </div>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Meta description</span>
          <textarea
            value={values.metaDescription}
            onChange={(event) => updateField("metaDescription", event.target.value)}
            rows={3}
            className="rounded-lg border border-border bg-surface px-4 py-3"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="OG image (URL)" value={values.ogImage} onChange={(event) => updateField("ogImage", event.target.value)} />
          <Input label="Google Analytics ID" value={values.googleAnalyticsId} onChange={(event) => updateField("googleAnalyticsId", event.target.value)} />
        </div>
      </Section>

      <Section title="Настройки контактов">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Основной телефон" value={values.contactPhone} onChange={(event) => updateField("contactPhone", event.target.value)} />
          <Input label="Email" type="email" value={values.contactEmail} onChange={(event) => updateField("contactEmail", event.target.value)} />
          <Input label="WhatsApp" value={values.contactWhatsapp} onChange={(event) => updateField("contactWhatsapp", event.target.value)} />
          <Input label="Google Maps URL" value={values.googleMapsUrl} onChange={(event) => updateField("googleMapsUrl", event.target.value)} />
        </div>
        {errors.contactEmail && <p className="text-sm text-red-600">{errors.contactEmail}</p>}
        <Input label="Адрес" value={values.contactAddress} onChange={(event) => updateField("contactAddress", event.target.value)} />
      </Section>

      <Section title="Настройки заявок">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Email для получения заявок" type="email" value={values.leadEmail} onChange={(event) => updateField("leadEmail", event.target.value)} />
          <Input label="WhatsApp для заявок" value={values.leadWhatsapp} onChange={(event) => updateField("leadWhatsapp", event.target.value)} />
        </div>
        {errors.leadEmail && <p className="text-sm text-red-600">{errors.leadEmail}</p>}
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={values.notificationsEnabled}
            onChange={(event) => updateField("notificationsEnabled", event.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span>Уведомления о новых заявках</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Автоматический статус новой заявки</span>
          <select
            value={values.defaultRequestStatus}
            onChange={(event) =>
              updateField("defaultRequestStatus", event.target.value as RequestStatus)
            }
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            {REQUEST_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {getRequestStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
      </Section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="dark" disabled={submitting}>
          {submitting ? "Сохранение..." : "Сохранить настройки"}
        </Button>
        {saved && <p className="text-sm text-emerald-700">Настройки сохранены</p>}
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      </div>
    </form>
  );
}
