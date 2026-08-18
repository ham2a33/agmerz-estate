import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { formatReadingTime, estimateReadingTimeFromPost } from "@/lib/blog";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "preview";
}

function getMetaLine(post: BlogPost): string | null {
  const parts: string[] = [];

  if (post.publishedAt) {
    parts.push(formatDate(post.publishedAt));
  }

  const readingTime = estimateReadingTimeFromPost(post);
  if (readingTime) {
    parts.push(formatReadingTime(readingTime));
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const href = `/blog/${post.slug}`;
  const metaLine = getMetaLine(post);

  if (variant === "preview") {
    return (
      <Link
        href={href}
        className="group card-hover overflow-hidden rounded-3xl border border-border bg-surface"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover image-hover"
            />
          )}
        </div>
        <div className="p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Недвижимость</p>
          <h3 className="mt-2 text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          {post.publishedAt && (
            <p className="mt-3 text-sm text-muted">{formatDate(post.publishedAt)}</p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="group block overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted md:aspect-[21/9]">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          )}
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          <h3 className="heading-section text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            {metaLine && <span>{metaLine}</span>}
            {post.author && <span>{post.author}</span>}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
            Читать
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover image-hover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted md:text-base">{post.excerpt}</p>

        <div className="mt-4 space-y-1 text-sm text-muted">
          {metaLine && <p>{metaLine}</p>}
          {post.author && <p>{post.author}</p>}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
          Читать
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
