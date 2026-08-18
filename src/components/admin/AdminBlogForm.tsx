"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { generatePropertySlug } from "@/lib/property-form";
import type { BlogPost } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { ImageUploadButton } from "./ImageUploadButton";

interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

const EMPTY_BLOG_FORM: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "AGMERZ ESTATE",
  publishedAt: "",
  isPublished: false,
};

function postToFormValues(post: BlogPost): BlogFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? "",
    author: post.author,
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : "",
    isPublished: post.isPublished,
  };
}

function validateBlogForm(values: BlogFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) errors.title = "Укажите название";
  if (!values.slug.trim()) errors.slug = "Укажите slug";
  if (!values.excerpt.trim()) errors.excerpt = "Укажите краткое описание";

  return errors;
}

interface AdminBlogFormProps {
  mode: "create" | "edit";
  post?: BlogPost;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminBlogForm({ mode, post }: AdminBlogFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>(
    post ? postToFormValues(post) : EMPTY_BLOG_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(post));

  function updateField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateBlogForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      excerpt: values.excerpt.trim(),
      content: values.content.trim(),
      coverImage: values.coverImage.trim() || null,
      author: values.author.trim() || "AGMERZ ESTATE",
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
      isPublished: values.isPublished,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/blog" : `/api/blog/post/${post?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.status === 409) {
        setSubmitError("Этот slug уже используется.");
        return;
      }

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить статью.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/blog/${data.data.id}`);
        router.refresh();
        return;
      }

      setValues(postToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить статью.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/blog/post/${post.id}`, { method: "DELETE" });
      if (!response.ok) return;
      router.push("/admin/blog");
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
            <Section title="Основная информация">
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
              <Input
                label="Автор"
                value={values.author}
                onChange={(event) => updateField("author", event.target.value)}
              />
            </Section>

            <Section title="Содержание">
              <Input
                label="Краткое описание *"
                value={values.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
              />
              {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Текст статьи</span>
                <textarea
                  value={values.content}
                  onChange={(event) => updateField("content", event.target.value)}
                  rows={14}
                  className="rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm"
                />
              </label>
            </Section>

            <Section title="Обложка">
              {values.coverImage && (
                <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded-lg bg-surface-muted">
                  <Image
                    src={values.coverImage}
                    alt="Обложка"
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                label="URL обложки"
                value={values.coverImage}
                onChange={(event) => updateField("coverImage", event.target.value)}
                placeholder="https://..."
              />
              <ImageUploadButton
                label="Загрузить обложку"
                onUploaded={(url) => updateField("coverImage", url)}
              />
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
              <div className="mt-4">
                <Input
                  label="Дата публикации"
                  type="date"
                  value={values.publishedAt}
                  onChange={(event) => updateField("publishedAt", event.target.value)}
                />
              </div>
            </section>

            {mode === "edit" && post && (
              <section className="rounded-xl border border-border bg-surface p-5 text-sm">
                <h3 className="font-medium text-foreground">Информация</h3>
                <dl className="mt-4 space-y-3 text-muted">
                  <div>
                    <dt className="text-xs uppercase tracking-wider">ID</dt>
                    <dd className="mt-1 text-foreground">{post.id}</dd>
                  </div>
                  {post.publishedAt && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider">Опубликовано</dt>
                      <dd className="mt-1 text-foreground">{formatDate(post.publishedAt)}</dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
              <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
                {submitting
                  ? "Сохранение..."
                  : mode === "create"
                    ? "Создать статью"
                    : "Сохранить изменения"}
              </Button>
              {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <Link
                href="/admin/blog"
                className="block text-center text-sm text-muted hover:text-foreground"
              >
                Назад к списку
              </Link>
              {mode === "edit" && post && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Удалить статью
                </button>
              )}
            </section>
          </aside>
        </div>
      </form>

      {post && (
        <AdminConfirmDialog
          open={deleteOpen}
          title="Удалить статью?"
          description={`Вы действительно хотите удалить статью «${post.title}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
