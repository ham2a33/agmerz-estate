"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CATALOG_DISTRICTS } from "@/lib/catalog";
import {
  EMPTY_PROPERTY_FORM,
  PROPERTY_FEATURE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  formValuesToPropertyInput,
  generatePropertySlug,
  propertyToFormValues,
  resolvePropertyType,
  showsFloorFields,
  showsRoomFields,
  validatePropertyForm,
  type PropertyFormValues,
} from "@/lib/property-form";
import type { Property, PropertyStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminImageManager } from "./AdminImageManager";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "active", label: "Активен" },
  { value: "reserved", label: "Забронирован" },
  { value: "sold", label: "Продан" },
  { value: "rented", label: "Сдан" },
  { value: "draft", label: "Черновик" },
];

interface AdminPropertyFormProps {
  mode: "create" | "edit";
  property?: Property;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminPropertyForm({ mode, property }: AdminPropertyFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(
    property ? propertyToFormValues(property) : EMPTY_PROPERTY_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(property));

  const resolvedType = resolvePropertyType(values.deal, values.type);

  const previewProperty = useMemo(() => {
    try {
      return formValuesToPropertyInput(values);
    } catch {
      return null;
    }
  }, [values]);

  function updateField<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugEdited) {
        next.slug = generatePropertySlug(String(value));
      }
      return next;
    });
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleFeature(feature: string) {
    setValues((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validatePropertyForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/properties" : `/api/properties/${property?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError(data.error ?? "Не удалось сохранить объект. Проверьте данные и попробуйте снова.");
        return;
      }

      setSaved(true);
      router.refresh();

      if (mode === "create") {
        router.push(`/admin/properties/${data.data.id}`);
      }
    } catch {
      setSubmitError("Не удалось сохранить объект. Проверьте данные и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!property) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/properties/${property.id}`, { method: "DELETE" });
      if (!response.ok) return;
      router.push("/admin/properties");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <Section title="01 Основная информация">
              <Input
                label="Название *"
                value={values.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              <Input
                label="Slug *"
                value={values.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  updateField("slug", event.target.value);
                }}
              />
              {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
            </Section>

            <Section title="02 Тип и сделка">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Тип недвижимости *</span>
                  <select
                    value={values.type}
                    onChange={(event) =>
                      updateField("type", event.target.value as PropertyFormValues["type"])
                    }
                    disabled={values.deal === "rent"}
                    className="rounded-lg border border-border bg-surface px-3 py-2.5"
                  >
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Сделка *</span>
                  <select
                    value={values.deal}
                    onChange={(event) =>
                      updateField("deal", event.target.value as PropertyFormValues["deal"])
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-2.5"
                  >
                    <option value="sale">Продажа</option>
                    <option value="rent">Аренда</option>
                  </select>
                </label>
              </div>
            </Section>

            <Section title="03 Цена и характеристики">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Цена *"
                  type="number"
                  min={0}
                  value={values.price}
                  onChange={(event) => updateField("price", event.target.value)}
                />
                <Input
                  label="Площадь *"
                  type="number"
                  min={0}
                  value={values.area}
                  onChange={(event) => updateField("area", event.target.value)}
                />
                {showsRoomFields(resolvedType) && (
                  <Input
                    label="Комнаты"
                    type="number"
                    min={0}
                    value={values.rooms}
                    onChange={(event) => updateField("rooms", event.target.value)}
                  />
                )}
                {showsFloorFields(resolvedType) && (
                  <>
                    <Input
                      label="Этаж"
                      type="number"
                      value={values.floor}
                      onChange={(event) => updateField("floor", event.target.value)}
                    />
                    <Input
                      label="Этажей в здании"
                      type="number"
                      value={values.totalFloors}
                      onChange={(event) => updateField("totalFloors", event.target.value)}
                    />
                  </>
                )}
                <Input
                  label="Год постройки"
                  type="number"
                  value={values.yearBuilt}
                  onChange={(event) => updateField("yearBuilt", event.target.value)}
                />
              </div>
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
              {errors.area && <p className="text-sm text-red-600">{errors.area}</p>}
            </Section>

            <Section title="04 Адрес">
              <Input
                label="Адрес *"
                value={values.address}
                onChange={(event) => updateField("address", event.target.value)}
              />
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Район *</span>
                <select
                  value={values.district}
                  onChange={(event) => updateField("district", event.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  <option value="">Выберите район</option>
                  {CATALOG_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>
              {errors.district && <p className="text-sm text-red-600">{errors.district}</p>}
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Latitude"
                  value={values.lat}
                  onChange={(event) => updateField("lat", event.target.value)}
                />
                <Input
                  label="Longitude"
                  value={values.lng}
                  onChange={(event) => updateField("lng", event.target.value)}
                />
              </div>
            </Section>

            <Section title="05 Описание">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Описание объекта</span>
                <textarea
                  value={values.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={6}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                />
              </label>
            </Section>

            <Section title="06 Особенности">
              <div className="flex flex-wrap gap-2">
                {PROPERTY_FEATURE_OPTIONS.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      values.features.includes(feature)
                        ? "border-foreground bg-foreground text-surface"
                        : "border-border bg-surface text-foreground"
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="07 Изображения">
              <AdminImageManager
                images={values.images}
                onChange={(images) => updateField("images", images)}
                errors={errors}
              />
            </Section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-medium text-foreground">08 Статус</h2>
              <select
                value={values.status}
                onChange={(event) =>
                  updateField("status", event.target.value as PropertyFormValues["status"])
                }
                className="mt-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-foreground">Preview</h3>
              {previewProperty && (
                <div className="mt-3 space-y-2 text-sm text-muted">
                  <p className="font-medium text-foreground">{previewProperty.title || "Без названия"}</p>
                  <p>{previewProperty.district || "Район не указан"}</p>
                  <p>
                    {previewProperty.price ? `${previewProperty.price.toLocaleString("ru-RU")} ₽` : "—"}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
                {submitting ? "Сохранение..." : mode === "create" ? "Создать объект" : "Сохранить изменения"}
              </Button>
              {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <Link href="/admin/properties" className="block text-center text-sm text-muted hover:text-foreground">
                Назад к списку
              </Link>
              {mode === "edit" && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Удалить объект
                </button>
              )}
            </section>
          </aside>
        </div>
      </form>

      <AdminConfirmDialog
        open={deleteOpen}
        title="Удалить объект?"
        description={
          property
            ? `Вы действительно хотите удалить «${property.title}»? Действие нельзя отменить.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </>
  );
}
