import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import Link from "next/link";
import type { BlogPost } from "@/types";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="heading-section text-foreground">Полезное о недвижимости</h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            Все статьи
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="preview" />
          ))}
        </div>
      </Container>
    </section>
  );
}
