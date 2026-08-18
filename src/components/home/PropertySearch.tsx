"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const propertyTypes = [
  { value: "apartment", label: "Квартира", href: "/catalog/apartments" },
  { value: "house", label: "Дом", href: "/catalog/houses" },
  { value: "commercial", label: "Коммерция", href: "/catalog/commercial" },
  { value: "land", label: "Участок", href: "/catalog/land" },
  { value: "rent", label: "Аренда", href: "/catalog/rent" },
];

const districts = [
  "Любой район",
  "Центральный",
  "Ахматовский",
  "Старопромысловский",
  "Ленинский",
];

const roomOptions = ["Любое", "1", "2", "3", "4+"];

const priceRanges = [
  { value: "", label: "Любая цена" },
  { value: "5000000", label: "до 5 млн ₽" },
  { value: "10000000", label: "до 10 млн ₽" },
  { value: "20000000", label: "до 20 млн ₽" },
  { value: "50000000", label: "до 50 млн ₽" },
];

const selectClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function PropertySearch() {
  const router = useRouter();
  const [type, setType] = useState("apartment");
  const [district, setDistrict] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const selectedType = propertyTypes.find((t) => t.value === type);
    const base = selectedType?.href ?? "/catalog";
    const params = new URLSearchParams();
    if (district && district !== "Любой район") params.set("district", district);
    if (rooms && rooms !== "Любое") params.set("rooms", rooms);
    if (price) params.set("maxPrice", price);
    const query = params.toString();
    router.push(query ? `${base}?${query}` : base);
  }

  return (
    <section className="relative z-10 -mt-4 pb-8 md:-mt-8 md:pb-12">
      <Container>
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-surface p-5 shadow-[0_8px_40px_rgba(17,17,17,0.06)] md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <label htmlFor="search-type" className="text-sm font-medium text-foreground">
                Тип недвижимости
              </label>
              <select
                id="search-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectClassName}
              >
                {propertyTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="search-district" className="text-sm font-medium text-foreground">
                Район
              </label>
              <select
                id="search-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={selectClassName}
              >
                {districts.map((item) => (
                  <option key={item} value={item === "Любой район" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="search-rooms" className="text-sm font-medium text-foreground">
                Количество комнат
              </label>
              <select
                id="search-rooms"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className={selectClassName}
              >
                {roomOptions.map((item) => (
                  <option key={item} value={item === "Любое" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="search-price" className="text-sm font-medium text-foreground">
                Цена
              </label>
              <select
                id="search-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={selectClassName}
              >
                {priceRanges.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end md:col-span-2 lg:col-span-1">
              <Button type="submit" variant="dark" size="lg" className="w-full">
                Найти недвижимость
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </section>
  );
}
