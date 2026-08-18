import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LinkButton } from "@/components/ui/Button";

export default function AdminPropertyNotFound() {
  return (
    <>
      <AdminHeader title="Объект не найден" />
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-foreground">Объект не найден</h1>
        <p className="mt-3 text-sm text-muted">
          Возможно, объект был удалён или ссылка указана неверно.
        </p>
        <div className="mt-6">
          <LinkButton href="/admin/properties" variant="dark">
            Вернуться к объектам
          </LinkButton>
        </div>
        <Link href="/admin/dashboard" className="mt-4 text-sm text-muted hover:text-foreground">
          Dashboard
        </Link>
      </div>
    </>
  );
}
