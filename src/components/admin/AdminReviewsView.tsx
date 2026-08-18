"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

type PublishFilter = "all" | "published" | "draft";

interface AdminReviewsViewProps {
  initialReviews: Review[];
}

export function AdminReviewsView({ initialReviews }: AdminReviewsViewProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState<PublishFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      if (publishFilter === "published" && !review.isPublished) return false;
      if (publishFilter === "draft" && review.isPublished) return false;

      if (!query) return true;

      return (
        review.name.toLowerCase().includes(query) ||
        review.text.toLowerCase().includes(query)
      );
    });
  }, [reviews, search, publishFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/reviews/${deleteTarget.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) return;

      setReviews((current) => current.filter((review) => review.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setPublishFilter("all");
  }

  const hasFilteredResults = filteredReviews.length > 0;

  return (
    <>
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-foreground md:text-3xl">Отзывы</h2>
            <p className="mt-2 text-sm text-muted">Отзывы клиентов на сайте</p>
          </div>
          <Link href="/admin/reviews/new">
            <Button variant="dark">Добавить отзыв</Button>
          </Link>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end">
          <Input
            label="Поиск"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Имя, текст..."
            className="flex-1"
          />
          <label className="flex flex-col gap-1.5 text-sm sm:w-48">
            <span className="font-medium">Статус</span>
            <select
              value={publishFilter}
              onChange={(event) => setPublishFilter(event.target.value as PublishFilter)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5"
            >
              <option value="all">Все</option>
              <option value="published">Опубликовано</option>
              <option value="draft">Черновик</option>
            </select>
          </label>
        </div>

        {!hasFilteredResults && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <h3 className="text-lg font-medium text-foreground">Ничего не найдено</h3>
            <p className="mt-3 text-sm text-muted">
              {reviews.length === 0
                ? "Добавьте первый отзыв."
                : "Попробуйте изменить параметры поиска или фильтры."}
            </p>
            {reviews.length === 0 ? (
              <Link href="/admin/reviews/new" className="mt-6 inline-block">
                <Button variant="dark">Добавить отзыв</Button>
              </Link>
            ) : (
              <button
                type="button"
                className="mt-6 rounded-2xl border border-border px-6 py-3 text-sm font-medium"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {hasFilteredResults && (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted/60">
                  <tr>
                    <th className="px-4 py-3 font-medium text-foreground">Имя</th>
                    <th className="px-4 py-3 font-medium text-foreground">Рейтинг</th>
                    <th className="px-4 py-3 font-medium text-foreground">Текст</th>
                    <th className="px-4 py-3 font-medium text-foreground">Дата</th>
                    <th className="px-4 py-3 font-medium text-foreground">Статус</th>
                    <th className="px-4 py-3 font-medium text-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/reviews/${review.id}`}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {review.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{review.rating} / 5</td>
                      <td className="max-w-xs truncate px-4 py-3 text-muted">{review.text}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(review.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            review.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-surface-muted text-muted"
                          }`}
                        >
                          {review.isPublished ? "Опубликовано" : "Черновик"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/reviews/${review.id}`}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                          >
                            Редактировать
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600"
                            onClick={() => setDeleteTarget(review)}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 lg:hidden">
              {filteredReviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/admin/reviews/${review.id}`} className="font-medium text-foreground">
                        {review.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        {review.rating} / 5 · {formatDate(review.createdAt)}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm text-muted">{review.text}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        review.isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-surface-muted text-muted"
                      }`}
                    >
                      {review.isPublished ? "Опубликовано" : "Черновик"}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/reviews/${review.id}`}
                      className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm"
                    >
                      Редактировать
                    </Link>
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-red-600"
                      onClick={() => setDeleteTarget(review)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить отзыв?"
        description={
          deleteTarget
            ? `Вы действительно хотите удалить отзыв от «${deleteTarget.name}»?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
