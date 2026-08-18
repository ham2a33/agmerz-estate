import Link from "next/link";

const actions = [
  {
    href: "/admin/properties/new",
    label: "Добавить объект",
    description: "Создать новую карточку объекта",
    icon: "+",
  },
  {
    href: "/admin/clients/new",
    label: "Добавить клиента",
    description: "Создать карточку клиента в CRM",
    icon: "👤",
  },
  {
    href: "/admin/categories/new",
    label: "Добавить категорию",
    description: "Управление категориями каталога",
    icon: "☰",
  },
  {
    href: "/admin/requests",
    label: "Посмотреть заявки",
    description: "Входящие заявки с сайта",
    icon: "→",
  },
];

export function AdminQuickActions() {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="text-base font-medium text-foreground">Быстрые действия</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border border-border bg-surface-muted/30 p-4 transition-colors hover:border-foreground/10 hover:bg-surface-muted/60"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-medium text-surface">
              {action.icon}
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">{action.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
