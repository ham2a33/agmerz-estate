"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ViewingFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function ViewingForm({ propertyId, propertyTitle }: ViewingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const comment = formData.get("comment") as string;

    const message = [
      `Заявка на просмотр: ${propertyTitle} (ID: ${propertyId})`,
      date && `Дата: ${date}`,
      time && `Время: ${time}`,
      comment && `Комментарий: ${comment}`,
    ]
      .filter(Boolean)
      .join(". ");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: "",
          type: "consultation",
          budget: null,
          district: null,
          rooms: null,
          message,
          propertyId,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setIsSuccess(true);
      form.reset();
    } catch {
      setError("Не удалось отправить заявку. Попробуйте позже или позвоните нам.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-border bg-surface-muted px-5 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-serif text-xl text-foreground">Заявка отправлена</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Спасибо! Мы свяжемся с вами для подтверждения времени просмотра.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Имя" name="name" required />
      <Input label="Телефон" name="phone" type="tel" required />
      <Input label="Дата" name="date" type="date" />
      <Input label="Время" name="time" type="time" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment" className="text-sm font-medium text-foreground">
          Комментарий
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Удобное время, дополнительные пожелания..."
        />
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <Button type="submit" variant="dark" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Отправка..." : "Записаться на просмотр"}
      </Button>
    </form>
  );
}
