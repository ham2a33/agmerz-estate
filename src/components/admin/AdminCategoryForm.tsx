"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoryStatusLabel } from "@/lib/admin-labels";
import {
  categoryToFormValues,
  EMPTY_CATEGORY_FORM,
  generateCategorySlug,
  validateCategoryForm,
  type CategoryFormValues,
} from "@/lib/category-admin-form";
import type { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { AdminCategoryImageManager } from "./AdminCategoryImageManager";

interface AdminCategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
  propertyCount?: number;
  categoryInUse?: boolean;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminCategoryForm({
  mode,
  category,
  propertyCount = 0,
  categoryInUse = false,
}: AdminCategoryFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>(
    category ? categoryToFormValues(category) : EMPTY_CATEGORY_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(category));

  useEffect(() => {
    if (category) {
      setValues(categoryToFormValues(category));
    }
  }, [category]);

  function updateField<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugEdited) {
        next.slug = generateCategorySlug(String(value));
      }
      return next;
    });
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateCategoryForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/categories" : `/api/categories/${category?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить категорию.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/categories/${data.data.id}`);
        router.refresh();
        return;
      }

      setValues(categoryToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить категорию.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!category) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      const data = await response.json();

      if (response.status === 409) {
        setDeleteError("Категория используется объектами недвижимости и не может быть удалена.");
        return;
      }

      if (!response.ok || !data.success) return;

      router.push("/admin/categories");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const resolvedPropertyCount = category ? propertyCount : 0;
  const resolvedCategoryInUse = category ? categoryInUse : false;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[900px] space-y-6 px-4 py-6 md:px-6 md:py-8"
      >
        <Section title="Основное">
          <Input
            label="Название *"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          <Input
            label="Slug *"
            value={values.slug}
            onChange={(event) => {
              setSlugEdited(true);
              updateField("slug", event.target.value);
            }}
          />
          {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Описание</span>
            <textarea
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="rounded-lg border border-border bg-surface px-4 py-3"
            />
          </label>
        </Section>

        {mode === "edit" && category && <AdminCategoryImageManager category={category} />}

        <Section title="Настройки отображения">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">Статус</span>
              <select
                value={values.isActive ? "active" : "hidden"}
                onChange={(event) => updateField("isActive", event.target.value === "active")}
                className="rounded-lg border border-border bg-surface px-3 py-2.5"
              >
                <option value="active">Активна</option>
                <option value="hidden">Скрыта</option>
              </select>
              <span className="text-xs text-muted">{getCategoryStatusLabel(values.isActive)}</span>
            </label>
            <Input
              label="Порядок сортировки"
              type="number"
              min={1}
              value={values.sortOrder}
              onChange={(event) => updateField("sortOrder", event.target.value)}
            />
          </div>
          {errors.sortOrder && <p className="text-sm text-red-600">{errors.sortOrder}</p>}
        </Section>

        {mode === "edit" && category && (
          <Section title="Статистика">
            <p className="text-sm text-muted">
              Объектов в категории: <span className="text-foreground">{resolvedPropertyCount}</span>
            </p>
            {resolvedCategoryInUse && (
              <p className="text-sm text-amber-700">
                Категория используется объектами недвижимости и не может быть удалена.
              </p>
            )}
          </Section>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" variant="dark" disabled={submitting}>
            {submitting
              ? "Сохранение..."
              : mode === "create"
                ? "Создать категорию"
                : "Сохранить изменения"}
          </Button>
          {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          <Link href="/admin/categories" className="text-sm text-muted hover:text-foreground sm:ml-auto">
            Назад к списку
          </Link>
          {mode === "edit" && category && !resolvedCategoryInUse && (
            <button
              type="button"
              className="rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
              onClick={() => {
                setDeleteError("");
                setDeleteOpen(true);
              }}
            >
              Удалить категорию
            </button>
          )}
        </div>
      </form>

      {category && (
        <AdminConfirmDialog
          open={deleteOpen}
          title="Удалить категорию?"
          description={
            deleteError || `Вы действительно хотите удалить категорию «${category.name}»?`
          }
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteOpen(false);
            setDeleteError("");
          }}
          loading={deleting}
        />
      )}
    </>
  );
}
