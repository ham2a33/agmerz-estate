import Link from "next/link";

export default function AdminClientNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-foreground">Клиент не найден</h1>
      <p className="mt-3 text-sm text-muted">Запрошенный клиент не существует или был удалён.</p>
      <Link
        href="/admin/clients"
        className="mt-6 inline-block rounded-2xl border border-border px-6 py-3 text-sm font-medium"
      >
        Вернуться к списку
      </Link>
    </div>
  );
}
