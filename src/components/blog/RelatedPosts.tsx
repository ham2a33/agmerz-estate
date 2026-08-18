import { Container } from "@/components/layout/Container";
import type { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="section-padding border-t border-border bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Возможно, вам будет интересно</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
