"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/format";
import {
  buildRequestPayload,
  EXTRA_OPTIONS,
  INITIAL_FORM_DATA,
  PROPERTY_TYPE_OPTIONS,
  REQUEST_DISTRICTS,
  ROOM_OPTIONS,
  showAreaFields,
  showRoomFields,
  validateRequestForm,
  type PropertyLookingType,
  type RequestFormData,
  type RequestFormErrors,
} from "@/lib/request-form";

const selectClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const inputClassName =
  "rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const PROGRESS_STEPS = [
  { num: "01", label: "Что ищете" },
  { num: "02", label: "Параметры" },
  { num: "03", label: "Контакт" },
];

function FormSection({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/80 bg-surface-muted/30 p-5 md:p-6">
      <SectionTitle step={step} title={title} />
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-accent">{message}</p>;
}

function SectionTitle({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-serif text-lg text-accent-soft">{step}</span>
      <h2 className="font-serif text-xl text-foreground md:text-2xl">{title}</h2>
    </div>
  );
}

export function PropertyRequestForm() {
  const [form, setForm] = useState<RequestFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<RequestFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function updateField<K extends keyof RequestFormData>(key: K, value: RequestFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  }

  function selectPropertyType(type: PropertyLookingType) {
    setForm((prev) => ({
      ...prev,
      propertyType: type,
      dealType: type === "rent" ? "rent" : prev.dealType === "rent" ? "buy" : prev.dealType,
    }));
    setErrors((prev) => ({ ...prev, propertyType: undefined }));
  }

  function toggleExtra(extra: string) {
    setForm((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter((e) => e !== extra)
        : [...prev.extras, extra],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validateRequestForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const payload = buildRequestPayload(form);
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
    } catch {
      setStatus("error");
      setErrors({ form: "Не удалось отправить заявку" });
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-10 md:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="heading-section mt-6 text-foreground">Заявка принята</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          Спасибо! Мы получили вашу заявку и скоро свяжемся с вами, чтобы подобрать подходящие
          варианты.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="/" variant="dark" size="lg">
            Вернуться на главную
          </LinkButton>
          <LinkButton href="/catalog" variant="outline" size="lg">
            Перейти в каталог
          </LinkButton>
        </div>
      </div>
    );
  }

  const budgetPreview =
    form.budgetMin || form.budgetMax
      ? [
          form.budgetMin ? formatPrice(Number(form.budgetMin)) : null,
          form.budgetMax ? formatPrice(Number(form.budgetMax)) : null,
        ]
          .filter(Boolean)
          .join(" — ")
      : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-border bg-surface p-5 shadow-[0_12px_48px_rgba(17,17,17,0.06)] md:p-8 lg:p-10"
    >
      {/* Progress indicator */}
      <div className="mb-8 flex flex-wrap gap-3 border-b border-border pb-8 md:gap-6">
        {PROGRESS_STEPS.map((step, index) => (
          <div key={step.num} className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-medium text-surface">
              {step.num}
            </span>
            <span className="text-sm font-medium text-foreground">{step.label}</span>
            {index < PROGRESS_STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {status === "error" && (
        <div className="mb-8 rounded-2xl border border-border bg-surface-muted px-5 py-6">
          <h3 className="font-serif text-xl text-foreground">Не удалось отправить заявку</h3>
          <p className="mt-2 text-sm text-muted">
            Попробуйте ещё раз или свяжитесь с нами напрямую.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setStatus("idle")}
          >
            Попробовать снова
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8">
        {/* 01 — Object */}
        <FormSection step="01" title="Что вы ищете">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
            {PROPERTY_TYPE_OPTIONS.map((option) => {
              const isActive = form.propertyType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectPropertyType(option.value)}
                  className={`rounded-2xl border px-3 py-3.5 text-sm font-medium transition-all duration-300 sm:px-4 sm:py-4 ${
                    isActive
                      ? "border-foreground bg-foreground text-surface shadow-[0_8px_24px_rgba(17,17,17,0.12)]"
                      : "border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.propertyType} />

          {form.propertyType && form.propertyType !== "rent" && (
            <div className="mt-5">
              <p className="text-sm font-medium text-foreground">Тип сделки</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    { value: "buy", label: "Покупка" },
                    { value: "rent", label: "Аренда" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("dealType", option.value)}
                    className={`rounded-2xl border px-5 py-2.5 text-sm transition-all ${
                      form.dealType === option.value
                        ? "border-foreground bg-foreground text-surface"
                        : "border-border bg-surface text-foreground hover:border-foreground/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        {/* 02 — Parameters */}
        <FormSection
          step="02"
          title="Параметры подбора"
          subtitle="Укажите бюджет, локацию и характеристики — так мы быстрее найдём подходящие варианты."
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted">Локация</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-foreground">
                    Район
                  </label>
                  <select
                    id="district"
                    value={form.district}
                    disabled={form.undecidedDistrict}
                    onChange={(e) => updateField("district", e.target.value)}
                    className={`${selectClassName} disabled:opacity-50`}
                  >
                    <option value="">Выберите район</option>
                    {REQUEST_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 self-end rounded-2xl border border-border px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={form.undecidedDistrict}
                    onChange={(e) => {
                      updateField("undecidedDistrict", e.target.checked);
                      if (e.target.checked) updateField("district", "");
                    }}
                    className="h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span className="text-sm text-foreground">Не определился с районом</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted">Бюджет</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetMin" className="mb-1.5 block text-sm font-medium text-foreground">
                    От, ₽
                  </label>
                  <input
                    id="budgetMin"
                    type="number"
                    min={0}
                    value={form.budgetMin}
                    onChange={(e) => updateField("budgetMin", e.target.value)}
                    className={`${inputClassName} w-full ${errors.budgetMin ? "border-accent" : ""}`}
                    placeholder="0"
                  />
                  <FieldError message={errors.budgetMin} />
                </div>
                <div>
                  <label htmlFor="budgetMax" className="mb-1.5 block text-sm font-medium text-foreground">
                    До, ₽
                  </label>
                  <input
                    id="budgetMax"
                    type="number"
                    min={0}
                    value={form.budgetMax}
                    onChange={(e) => updateField("budgetMax", e.target.value)}
                    className={`${inputClassName} w-full ${errors.budgetMax ? "border-accent" : ""}`}
                    placeholder="10 000 000"
                  />
                  <FieldError message={errors.budgetMax} />
                </div>
              </div>
              {budgetPreview && (
                <p className="mt-2 text-sm text-muted">{budgetPreview}</p>
              )}
            </div>

            {form.propertyType && (
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted">
                  Характеристики
                </h3>

                {showRoomFields(form.propertyType) && (
                  <div className="mt-4">
                    <p className="text-sm text-muted">Количество комнат</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ROOM_OPTIONS.map((room) => (
                        <button
                          key={room}
                          type="button"
                          onClick={() => updateField("rooms", form.rooms === room ? "" : room)}
                          className={`rounded-2xl border px-4 py-2.5 text-sm transition-all ${
                            form.rooms === room
                              ? "border-foreground bg-foreground text-surface"
                              : "border-border bg-surface text-foreground hover:border-foreground/20"
                          }`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showAreaFields(form.propertyType) && (
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="areaMin" className="mb-1.5 block text-sm font-medium text-foreground">
                        Площадь от, м²
                      </label>
                      <input
                        id="areaMin"
                        type="number"
                        min={0}
                        value={form.areaMin}
                        onChange={(e) => updateField("areaMin", e.target.value)}
                        className={`${inputClassName} w-full ${errors.areaMin ? "border-accent" : ""}`}
                      />
                      <FieldError message={errors.areaMin} />
                    </div>
                    <div>
                      <label htmlFor="areaMax" className="mb-1.5 block text-sm font-medium text-foreground">
                        Площадь до, м²
                      </label>
                      <input
                        id="areaMax"
                        type="number"
                        min={0}
                        value={form.areaMax}
                        onChange={(e) => updateField("areaMax", e.target.value)}
                        className={`${inputClassName} w-full ${errors.areaMax ? "border-accent" : ""}`}
                      />
                      <FieldError message={errors.areaMax} />
                    </div>
                  </div>
                )}

                {showRoomFields(form.propertyType) && (
                  <div className="mt-5">
                    <p className="text-sm text-muted">Дополнительно</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {EXTRA_OPTIONS.map((extra) => (
                        <button
                          key={extra}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={`rounded-2xl border px-3 py-2 text-sm transition-all ${
                            form.extras.includes(extra)
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground"
                          }`}
                        >
                          {extra}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="message" className="text-sm font-medium uppercase tracking-wider text-muted">
                Комментарий
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Расскажите подробнее, что вы ищете..."
                className={`${inputClassName} mt-3 w-full resize-none`}
              />
            </div>
          </div>
        </FormSection>

        {/* 03 — Contacts */}
        <FormSection
          step="03"
          title="Контактные данные"
          subtitle="Оставьте удобный способ связи — мы свяжемся, чтобы уточнить детали."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Input
                label="Имя"
                name="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Как к вам обращаться"
                className={inputClassName}
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <Input
                label="Телефон / WhatsApp"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className={inputClassName}
              />
              <FieldError message={errors.phone} />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Email (необязательно)"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="example@mail.ru"
                className={inputClassName}
              />
              <FieldError message={errors.email} />
            </div>
          </div>

          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => updateField("consent", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border accent-foreground"
            />
            <span className="text-sm leading-relaxed text-muted">
              Я согласен на обработку персональных данных
            </span>
          </label>
          <FieldError message={errors.consent} />
        </FormSection>

        <div className="rounded-2xl border border-border/80 bg-surface-muted/20 px-5 py-6 md:px-6">
          <Button
            type="submit"
            variant="dark"
            size="lg"
            disabled={status === "submitting"}
            className="w-full uppercase tracking-[0.12em] sm:w-auto sm:min-w-[300px]"
          >
            {status === "submitting" ? "Отправка..." : "Подобрать недвижимость"}
          </Button>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Мы свяжемся с вами, чтобы уточнить детали и предложить подходящие варианты.
          </p>
        </div>
      </div>
    </form>
  );
}
