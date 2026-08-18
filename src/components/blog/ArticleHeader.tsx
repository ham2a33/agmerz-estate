import Link from "next/link";
import { formatDate } from "@/lib/format";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/blog";
import type { BlogPost } from "@/types";

interface ArticleHeaderProps {
  post: BlogPost;
}

export async function ArticleHeader({ post }: ArticleHeaderProps) {
  const readingTime = await getReadingTimeMinutes(post);

  return (
    <header>
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">
            /
          </li>
          <li>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Блог
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">
            /
          </li>
          <li className="max-w-[220px] truncate font-medium text-foreground sm:max-w-md">
            {post.title}
          </li>
        </ol>
      </nav>

      <h1 className="heading-section max-w-4xl text-foreground">{post.title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
        {post.excerpt}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
        {post.author && <span>{post.author}</span>}
        {readingTime && <span>{formatReadingTime(readingTime)}</span>}
      </div>
    </header>
  );
}
