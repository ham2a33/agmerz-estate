"use client";

import { FormEvent, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  buildContactPayload,
  CONTACT_TOPICS,
  INITIAL_CONTACT_FORM,
  validateContactForm,
  type ContactFormData,
  type ContactFormErrors,
  type ContactTopic,
} from "@/lib/contact-form";

const selectClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const textareaClassName =
  "w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-accent">{message}</p>;
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_CONTACT_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function updateField<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validateContactForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const payload = buildContactPayload(form);
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-10 md:py-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="heading-section mt-6 text-foreground">Спасибо за сообщение</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          Мы получили вашу заявку и свяжемся с вами в ближайшее время.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="/" variant="dark" size="lg">
            На главную
          </LinkButton>
          <LinkButton href="/catalog" variant="outline" size="lg">
            В каталог
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <h2 className="font-serif text-2xl text-foreground">Напишите нам</h2>
      <p className="mt-2 text-sm text-muted">Заполните форму, и мы ответим в ближайшее время.</p>

      {status === "error" && (
        <div className="mt-6 rounded-2xl border border-border bg-surface-muted px-5 py-6">
          <h3 className="font-serif text-xl text-foreground">Не удалось отправить сообщение</h3>
          <p className="mt-2 text-sm text-muted">
            Попробуйте ещё раз или свяжитесь с нами напрямую.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
            Попробовать снова
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Input
              label="Имя *"
              name="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="rounded-2xl py-3.5"
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <Input
              label="Телефон *"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="rounded-2xl py-3.5"
            />
            <FieldError message={errors.phone} />
          </div>
        </div>

        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="rounded-2xl py-3.5"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-foreground">
            Тема
          </label>
          <select
            id="topic"
            value={form.topic}
            onChange={(e) => updateField("topic", e.target.value as ContactTopic | "")}
            className={selectClassName}
          >
            <option value="">Выберите тему</option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
            Сообщение *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${textareaClassName} ${errors.message ? "border-accent" : ""}`}
            placeholder="Ваш вопрос или комментарий..."
          />
          <FieldError message={errors.message} />
        </div>

        <Button
          type="submit"
          variant="dark"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-auto sm:min-w-[240px]"
        >
          {status === "submitting" ? "Отправка..." : "Отправить сообщение"}
        </Button>
      </form>
    </div>
  );
}
