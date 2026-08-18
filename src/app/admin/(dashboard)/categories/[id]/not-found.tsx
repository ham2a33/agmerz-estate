import Link from "next/link";

export default function AdminCategoryNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-foreground">Категория не найдена</h1>
      <p className="mt-3 text-sm text-muted">Запрошенная категория не существует или была удалена.</p>
      <Link
        href="/admin/categories"
        className="mt-6 inline-block rounded-2xl border border-border px-6 py-3 text-sm font-medium"
      >
        Вернуться к списку
      </Link>
    </div>
  );
}
