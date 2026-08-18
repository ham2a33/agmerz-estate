import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

export default function PropertyNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-muted text-muted">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
        </svg>
      </div>
      <h1 className="heading-section mt-6 text-foreground">Объект не найден</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Возможно, объект был снят с публикации или больше недоступен.
      </p>
      <div className="mt-8">
        <LinkButton href="/catalog" variant="dark" size="lg">
          Вернуться в каталог
        </LinkButton>
      </div>
      <Link href="/" className="mt-4 text-sm text-muted transition-colors hover:text-foreground">
        На главную
      </Link>
    </Container>
  );
}
