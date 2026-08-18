"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { getClientStatusLabel, getClientTypeLabel, getRequestTypeLabel } from "@/lib/admin-labels";
import {
  getClientFullName,
  getEmailHref,
  getPhoneHref,
} from "@/lib/contact-helpers";
import {
  clientToFormValues,
  EMPTY_CLIENT_FORM,
  validateClientForm,
  type ClientFormValues,
} from "@/lib/client-admin-form";
import type { Client, ClientStatus, ClientType, Property, Request } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { AdminStatusBadge } from "./AdminStatusBadge";

const STATUS_OPTIONS: ClientStatus[] = ["new", "active", "in_progress", "completed", "inactive"];
const TYPE_OPTIONS: ClientType[] = ["buyer", "seller", "renter", "landlord", "investor"];

interface AdminClientFormProps {
  mode: "create" | "edit";
  client?: Client;
  relatedRequests?: Request[];
  relatedProperties?: Property[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function AdminClientForm({
  mode,
  client,
  relatedRequests = [],
  relatedProperties = [],
}: AdminClientFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ClientFormValues>(
    client ? clientToFormValues(client) : EMPTY_CLIENT_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateField<K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSaved(false);

    const validationErrors = validateClientForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/clients" : `/api/clients/${client?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError("Не удалось сохранить клиента.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/clients/${data.data.id}`);
        router.refresh();
        return;
      }

      setValues(clientToFormValues(data.data));
      setSaved(true);
      router.refresh();
    } catch {
      setSubmitError("Не удалось сохранить клиента.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!client) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
      if (!response.ok) return;
      router.push("/admin/clients");
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
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Имя *"
                  value={values.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                />
                <Input
                  label="Фамилия"
                  value={values.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                />
              </div>
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
            </Section>

            <Section title="Контакты">
              <Input
                label="Телефон"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </Section>

            <Section title="CRM">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Тип клиента</span>
                  <select
                    value={values.type}
                    onChange={(event) =>
                      updateField("type", event.target.value as ClientFormValues["type"])
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-2.5"
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {getClientTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Ответственный менеджер"
                  value={values.assignedManager}
                  onChange={(event) => updateField("assignedManager", event.target.value)}
                />
              </div>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Комментарий</span>
                <textarea
                  value={values.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  rows={5}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                />
              </label>
            </Section>

            {mode === "edit" && (
              <>
                <Section title="Связанные заявки">
                  {relatedRequests.length === 0 ? (
                    <p className="text-sm text-muted">Связанных заявок пока нет.</p>
                  ) : (
                    <div className="space-y-3">
                      {relatedRequests.map((request) => (
                        <Link
                          key={request.id}
                          href={`/admin/requests/${request.id}`}
                          className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-muted/40"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">
                              {getRequestTypeLabel(request.type)} · #{request.id}
                            </p>
                            <AdminStatusBadge kind="request" status={request.status} />
                          </div>
                          <p className="mt-1 text-xs text-muted">{formatDate(request.createdAt)}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </Section>

                <Section title="Связанные объекты">
                  {relatedProperties.length === 0 ? (
                    <p className="text-sm text-muted">Связанных объектов пока нет.</p>
                  ) : (
                    <div className="space-y-3">
                      {relatedProperties.map((property) => (
                        <Link
                          key={property.id}
                          href={`/admin/properties/${property.id}`}
                          className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-muted/40"
                        >
                          <p className="text-sm font-medium text-foreground">{property.title}</p>
                          <p className="mt-1 text-xs text-muted">{property.address}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </Section>
              </>
            )}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-medium text-foreground">Статус</h2>
              <select
                value={values.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ClientFormValues["status"])
                }
                className="mt-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {getClientStatusLabel(status)}
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <AdminStatusBadge kind="client" status={values.status} />
              </div>
            </section>

            {mode === "edit" && client && (
              <section className="rounded-xl border border-border bg-surface p-5 text-sm">
                <h3 className="font-medium text-foreground">Информация</h3>
                <dl className="mt-4 space-y-3 text-muted">
                  <div>
                    <dt className="text-xs uppercase tracking-wider">Создан</dt>
                    <dd className="mt-1 text-foreground">{formatDate(client.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider">Обновлён</dt>
                    <dd className="mt-1 text-foreground">{formatDate(client.updatedAt)}</dd>
                  </div>
                  {values.phone && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider">Телефон</dt>
                      <dd className="mt-1">
                        <a href={getPhoneHref(values.phone)} className="text-foreground hover:text-accent">
                          {values.phone}
                        </a>
                      </dd>
                    </div>
                  )}
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
            )}

            <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
              <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
                {submitting
                  ? "Сохранение..."
                  : mode === "create"
                    ? "Создать клиента"
                    : "Сохранить изменения"}
              </Button>
              {saved && <p className="text-sm text-emerald-700">Сохранено</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <Link
                href="/admin/clients"
                className="block text-center text-sm text-muted hover:text-foreground"
              >
                Назад к списку
              </Link>
              {mode === "edit" && client && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Удалить клиента
                </button>
              )}
            </section>
          </aside>
        </div>
      </form>

      {client && (
        <AdminConfirmDialog
          open={deleteOpen}
          title="Удалить клиента?"
          description={`Вы действительно хотите удалить клиента «${getClientFullName(client)}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
