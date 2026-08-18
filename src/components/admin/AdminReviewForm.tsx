"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { ImageUploadButton } from "./ImageUploadButton";

interface ReviewFormValues {
  name: string;
  avatar: string;
  rating: string;
  text: string;
  isPublished: boolean;
}

const EMPTY_REVIEW_FORM: ReviewFormValues = {
  name: "",
  avatar: "",
  rating: "5",
  text: "",
  isPublished: true,
};

function reviewToFormValues(review: Review): ReviewFormValues {
  return {
    name: review.name,
    avatar: review.avatar ?? "",
    rating: String(review.rating),
    text: review.text,
    isPublished: review.isPublished,
  };
}

function validateReviewForm(values: ReviewFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) errors.name = "Укажите имя";
  if (!values.text.trim()) errors.text = "Укажите текст отзыва";

  const rating = Number(values.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Рейтинг от 1 до 5";
  }

  return errors;
}

interface AdminReviewFormProps {
  mode: "create" | "edit";
  review?: Review;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminReviewForm({ mode, review }: AdminReviewFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ReviewFormValues>(
    review ? reviewToFormValues(review) : EMPTY_REVIEW_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateField<K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateReviewForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const payload = {
      name: values.name.trim(),
      avatar: values.avatar.trim() || null,
      rating: Number(values.rating),
      text: values.text.trim(),
      isPublished: values.isPublished,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/reviews" : `/api/reviews/${review?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить отзыв.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/reviews/${data.data.id}`);
        router.refresh();
        return;
      }

      setValues(reviewToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить отзыв.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!review) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!response.ok) return;
      router.push("/admin/reviews");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 md:px-6 md:py-8"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <Section title="Информация об авторе">
              <Input
                label="Имя *"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Рейтинг *</span>
                <select
                  value={values.rating}
                  onChange={(event) => updateField("rating", event.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} / 5
                    </option>
                  ))}
                </select>
              </label>
              {errors.rating && <p className="text-sm text-red-600">{errors.rating}</p>}
            </Section>

            <Section title="Аватар">
              {values.avatar && (
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-surface-muted">
                  <Image
                    src={values.avatar}
                    alt={values.name || "Аватар"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                label="URL аватара"
                value={values.avatar}
                onChange={(event) => updateField("avatar", event.target.value)}
                placeholder="https://..."
              />
              <ImageUploadButton
                label="Загрузить аватар"
                onUploaded={(url) => updateField("avatar", url)}
              />
            </Section>

            <Section title="Текст отзыва">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Текст *</span>
                <textarea
                  value={values.text}
                  onChange={(event) => updateField("text", event.target.value)}
                  rows={8}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                />
              </label>
              {errors.text && <p className="text-sm text-red-600">{errors.text}</p>}
            </Section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-medium text-foreground">Публикация</h2>
              <label className="mt-4 flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={values.isPublished}
                  onChange={(event) => updateField("isPublished", event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span>Опубликовано</span>
              </label>
            </section>

            {mode === "edit" && review && (
              <section className="rounded-xl border border-border bg-surface p-5 text-sm">
                <h3 className="font-medium text-foreground">Информация</h3>
                <dl className="mt-4 space-y-3 text-muted">
                  <div>
                    <dt className="text-xs uppercase tracking-wider">Создан</dt>
                    <dd className="mt-1 text-foreground">{formatDate(review.createdAt)}</dd>
                  </div>
                </dl>
              </section>
            )}

            <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
              <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
                {submitting
                  ? "Сохранение..."
                  : mode === "create"
                    ? "Создать отзыв"
                    : "Сохранить изменения"}
              </Button>
              {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <Link
                href="/admin/reviews"
                className="block text-center text-sm text-muted hover:text-foreground"
              >
                Назад к списку
              </Link>
              {mode === "edit" && review && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Удалить отзыв
                </button>
              )}
            </section>
          </aside>
        </div>
      </form>

      {review && (
        <AdminConfirmDialog
          open={deleteOpen}
          title="Удалить отзыв?"
          description={`Вы действительно хотите удалить отзыв от «${review.name}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
