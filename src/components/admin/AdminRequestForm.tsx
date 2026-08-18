"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { getRequestStatusLabel, getRequestTypeLabel } from "@/lib/admin-labels";
import {
  requestToFormValues,
  validateRequestAdminForm,
  type RequestFormValues,
} from "@/lib/request-admin-form";
import { getEmailHref, getPhoneHref } from "@/lib/contact-helpers";
import type { Request, RequestStatus, RequestType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { AdminStatusBadge } from "./AdminStatusBadge";

const STATUS_OPTIONS: RequestStatus[] = ["new", "in_progress", "completed", "cancelled"];
const TYPE_OPTIONS: RequestType[] = ["buy", "rent", "sell", "consultation", "contact"];

interface AdminRequestFormProps {
  request: Request;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminRequestForm({ request }: AdminRequestFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RequestFormValues>(requestToFormValues(request));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateField<K extends keyof RequestFormValues>(key: K, value: RequestFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateRequestAdminForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить заявку.");
        return;
      }

      setValues(requestToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить заявку.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      const response = await fetch(`/api/requests/${request.id}`, { method: "DELETE" });
      if (!response.ok) return;
      router.push("/admin/requests");
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
            <Section title="Контактные данные">
              <Input
                label="Имя *"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              <Input
                label="Телефон *"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              <Input
                label="Email"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </Section>

            <Section title="Параметры заявки">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Тип</span>
                  <select
                    value={values.type}
                    onChange={(event) =>
                      updateField("type", event.target.value as RequestFormValues["type"])
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-2.5"
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {getRequestTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Бюджет"
                  type="number"
                  min={0}
                  value={values.budget}
                  onChange={(event) => updateField("budget", event.target.value)}
                />
                <Input
                  label="Район"
                  value={values.district}
                  onChange={(event) => updateField("district", event.target.value)}
                />
                <Input
                  label="Комнаты"
                  type="number"
                  min={0}
                  value={values.rooms}
                  onChange={(event) => updateField("rooms", event.target.value)}
                />
              </div>
            </Section>

            <Section title="Сообщение клиента">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Сообщение</span>
                <textarea
                  value={values.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={6}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                />
              </label>
            </Section>

            <Section title="Внутренние заметки">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Заметки для команды</span>
                <textarea
                  value={values.internalNotes}
                  onChange={(event) => updateField("internalNotes", event.target.value)}
                  rows={5}
                  placeholder="Внутренние комментарии, не видны клиенту"
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                />
              </label>
            </Section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-medium text-foreground">Статус</h2>
              <select
                value={values.status}
                onChange={(event) =>
                  updateField("status", event.target.value as RequestFormValues["status"])
                }
                className="mt-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {getRequestStatusLabel(status)}
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <AdminStatusBadge kind="request" status={values.status} />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5 text-sm">
              <h3 className="font-medium text-foreground">Информация</h3>
              <dl className="mt-4 space-y-3 text-muted">
                <div>
                  <dt className="text-xs uppercase tracking-wider">Создана</dt>
                  <dd className="mt-1 text-foreground">{formatDate(request.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider">Телефон</dt>
                  <dd className="mt-1">
                    <a href={getPhoneHref(values.phone)} className="text-foreground hover:text-accent">
                      {values.phone}
                    </a>
                  </dd>
                </div>
                {values.email && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider">Email</dt>
                    <dd className="mt-1">
                      <a href={getEmailHref(values.email)} className="text-foreground hover:text-accent">
                        {values.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
                {submitting ? "Сохранение..." : "Сохранить изменения"}
              </Button>
              {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <Link
                href="/admin/requests"
                className="block text-center text-sm text-muted hover:text-foreground"
              >
                Назад к списку
              </Link>
              <button
                type="button"
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
                onClick={() => setDeleteOpen(true)}
              >
                Удалить заявку
              </button>
            </section>
          </aside>
        </div>
      </form>

      <AdminConfirmDialog
        open={deleteOpen}
        title="Удалить заявку?"
        description={`Вы действительно хотите удалить заявку от «${request.name}»? Действие нельзя отменить.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </>
  );
}
