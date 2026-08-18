import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

export default function BlogPostNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-muted text-muted">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      </div>
      <h1 className="heading-section mt-6 text-foreground">Статья не найдена</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Возможно, она была удалена или перемещена.
      </p>
      <div className="mt-8">
        <LinkButton href="/blog" variant="dark" size="lg">
          Вернуться в блог
        </LinkButton>
      </div>
    </Container>
  );
}
