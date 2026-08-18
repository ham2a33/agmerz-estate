"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  CATALOG_DISTRICTS,
  countActiveFilters,
  type CatalogCategorySlug,
  type CatalogFiltersState,
  type CatalogPropertyType,
  type CatalogDealType,
} from "@/lib/catalog";

interface CatalogFiltersProps {
  filters: CatalogFiltersState;
  categorySlug: CatalogCategorySlug;
  onApply: (filters: CatalogFiltersState) => void;
  onReset: () => void;
  mobileSort?: React.ReactNode;
}

const propertyTypes: { value: CatalogPropertyType; label: string }[] = [
  { value: "apartment", label: "Квартира" },
  { value: "house", label: "Дом" },
  { value: "commercial", label: "Коммерция" },
  { value: "land", label: "Участок" },
];

const dealTypes: { value: CatalogDealType; label: string }[] = [
  { value: "sale", label: "Продажа" },
  { value: "rent", label: "Аренда" },
];

const roomOptions = ["1", "2", "3", "4+"];

const selectClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const inputClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function CatalogFilters({
  filters,
  categorySlug,
  onApply,
  onReset,
  mobileSort,
}: CatalogFiltersProps) {
  const [draft, setDraft] = useState(filters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const activeCount = countActiveFilters(filters, categorySlug);
  const showTypeFilter = categorySlug === "all";

  function updateDraft(partial: Partial<CatalogFiltersState>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function applyDraft(next?: CatalogFiltersState) {
    onApply(next ?? draft);
    setDrawerOpen(false);
    setOpenDropdown(null);
  }

  function handleReset() {
    onReset();
    setDrawerOpen(false);
    setOpenDropdown(null);
  }

  function toggleDropdown(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function getTypeLabel() {
    if (!draft.type) return "Тип";
    return propertyTypes.find((t) => t.value === draft.type)?.label ?? "Тип";
  }

  function getDistrictLabel() {
    return draft.district || "Район";
  }

  function getRoomsLabel() {
    if (!draft.rooms) return "Комнаты";
    return draft.rooms === "4+" ? "4+ комн." : `${draft.rooms} комн.`;
  }

  function getPriceLabel() {
    if (draft.minPrice || draft.maxPrice) {
      const from = draft.minPrice ? `${Number(draft.minPrice).toLocaleString("ru-RU")}` : "0";
      const to = draft.maxPrice ? `${Number(draft.maxPrice).toLocaleString("ru-RU")}` : "∞";
      return `${from} – ${to} ₽`;
    }
    return "Цена";
  }

  function getAreaLabel() {
    if (draft.minArea || draft.maxArea) {
      const from = draft.minArea || "0";
      const to = draft.maxArea || "∞";
      return `${from} – ${to} м²`;
    }
    return "Площадь";
  }

  const filterFields = (
    <div className="flex flex-col gap-5">
      {showTypeFilter && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Тип недвижимости</label>
          <select
            value={draft.type}
            onChange={(e) => updateDraft({ type: e.target.value as CatalogPropertyType | "" })}
            className={selectClassName}
          >
            <option value="">Все типы</option>
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Тип сделки</label>
        <select
          value={draft.deal}
          onChange={(e) => updateDraft({ deal: e.target.value as CatalogDealType | "" })}
          className={selectClassName}
        >
          <option value="">Все</option>
          {dealTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Район</label>
        <select
          value={draft.district}
          onChange={(e) => updateDraft({ district: e.target.value })}
          className={selectClassName}
        >
          <option value="">Все районы</option>
          {CATALOG_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Комнаты</label>
        <div className="flex flex-wrap gap-2">
          {roomOptions.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => updateDraft({ rooms: draft.rooms === room ? "" : room })}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition-colors ${
                draft.rooms === room
                  ? "border-foreground bg-foreground text-surface"
                  : "border-border bg-surface text-foreground hover:border-foreground/30"
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Цена, ₽</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={draft.minPrice}
            onChange={(e) => updateDraft({ minPrice: e.target.value })}
            className={inputClassName}
          />
          <input
            type="number"
            placeholder="До"
            value={draft.maxPrice}
            onChange={(e) => updateDraft({ maxPrice: e.target.value })}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Площадь, м²</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={draft.minArea}
            onChange={(e) => updateDraft({ minArea: e.target.value })}
            className={inputClassName}
          />
          <input
            type="number"
            placeholder="До"
            value={draft.maxArea}
            onChange={(e) => updateDraft({ maxArea: e.target.value })}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile controls */}
      <div className="flex gap-3 sm:hidden">
        <Button
          variant="outline"
          className="flex-1 justify-center"
          onClick={() => setDrawerOpen(true)}
        >
          Фильтры
          {activeCount > 0 && (
            <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-surface">
              {activeCount}
            </span>
          )}
        </Button>
        {mobileSort && <div className="min-w-0 flex-1">{mobileSort}</div>}
      </div>

      {/* Desktop filter bar */}
      <div ref={barRef} className="relative hidden sm:block">
        <div className="flex flex-wrap items-center gap-2">
          {showTypeFilter && (
            <FilterChip
              label={getTypeLabel()}
              active={Boolean(draft.type)}
              isOpen={openDropdown === "type"}
              onClick={() => toggleDropdown("type")}
            >
              <div className="flex flex-col gap-1 p-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...draft, type: "" as const };
                    setDraft(next);
                    applyDraft(next);
                  }}
                  className="rounded-xl px-3 py-2 text-left text-sm hover:bg-surface-muted"
                >
                  Все типы
                </button>
                {propertyTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      const next = { ...draft, type: t.value };
                      setDraft(next);
                      applyDraft(next);
                    }}
                    className={`rounded-xl px-3 py-2 text-left text-sm hover:bg-surface-muted ${draft.type === t.value ? "font-medium text-accent" : ""}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </FilterChip>
          )}

          <FilterChip
            label={getDistrictLabel()}
            active={Boolean(draft.district)}
            isOpen={openDropdown === "district"}
            onClick={() => toggleDropdown("district")}
          >
            <div className="max-h-60 overflow-y-auto p-1">
              <button
                type="button"
                onClick={() => {
                  const next = { ...draft, district: "" };
                  setDraft(next);
                  applyDraft(next);
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                Все районы
              </button>
              {CATALOG_DISTRICTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    const next = { ...draft, district: d };
                    setDraft(next);
                    applyDraft(next);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-surface-muted ${draft.district === d ? "font-medium text-accent" : ""}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </FilterChip>

          <FilterChip
            label={getRoomsLabel()}
            active={Boolean(draft.rooms)}
            isOpen={openDropdown === "rooms"}
            onClick={() => toggleDropdown("rooms")}
          >
            <div className="flex gap-1 p-2">
              {roomOptions.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => {
                    const next = { ...draft, rooms: draft.rooms === room ? "" : room };
                    setDraft(next);
                    applyDraft(next);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                    draft.rooms === room
                      ? "bg-foreground text-surface"
                      : "hover:bg-surface-muted"
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </FilterChip>

          <FilterChip
            label={getPriceLabel()}
            active={Boolean(draft.minPrice || draft.maxPrice)}
            isOpen={openDropdown === "price"}
            onClick={() => toggleDropdown("price")}
          >
            <div className="grid w-64 grid-cols-2 gap-2 p-2">
              <input
                type="number"
                placeholder="От"
                value={draft.minPrice}
                onChange={(e) => updateDraft({ minPrice: e.target.value })}
                className={inputClassName}
              />
              <input
                type="number"
                placeholder="До"
                value={draft.maxPrice}
                onChange={(e) => updateDraft({ maxPrice: e.target.value })}
                className={inputClassName}
              />
              <Button
                variant="dark"
                className="col-span-2 mt-1"
                onClick={() => applyDraft()}
              >
                Применить
              </Button>
            </div>
          </FilterChip>

          <FilterChip
            label={getAreaLabel()}
            active={Boolean(draft.minArea || draft.maxArea)}
            isOpen={openDropdown === "area"}
            onClick={() => toggleDropdown("area")}
          >
            <div className="grid w-64 grid-cols-2 gap-2 p-2">
              <input
                type="number"
                placeholder="От"
                value={draft.minArea}
                onChange={(e) => updateDraft({ minArea: e.target.value })}
                className={inputClassName}
              />
              <input
                type="number"
                placeholder="До"
                value={draft.maxArea}
                onChange={(e) => updateDraft({ maxArea: e.target.value })}
                className={inputClassName}
              />
              <Button
                variant="dark"
                className="col-span-2 mt-1"
                onClick={() => applyDraft()}
              >
                Применить
              </Button>
            </div>
          </FilterChip>

          <FilterChip
            label={`Фильтры${activeCount > 0 ? ` (${activeCount})` : ""}`}
            active={activeCount > 0}
            isOpen={openDropdown === "all"}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Drawer / modal */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-6 sm:max-w-lg sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Фильтры</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-surface-muted hover:text-foreground"
                aria-label="Закрыть"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {filterFields}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="dark" className="flex-1" onClick={() => applyDraft()}>
                Показать объекты
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  isOpen,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-sm transition-all duration-300 ${
          active || isOpen
            ? "border-foreground/20 bg-surface text-foreground"
            : "border-border bg-surface text-muted hover:border-foreground/10 hover:text-foreground"
        }`}
      >
        <span className="max-w-[140px] truncate">{label}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && children && (
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-2xl border border-border bg-surface shadow-[0_8px_30px_rgba(17,17,17,0.08)]">
          {children}
        </div>
      )}
    </div>
  );
}
