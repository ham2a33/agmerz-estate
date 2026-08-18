import { Container } from "@/components/layout/Container";
import type { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <section className="section-padding border-b border-border/60 bg-surface-muted/50 pb-0">
      <Container>
        <h2 className="heading-section text-foreground">Featured Article</h2>
        <div className="mt-8 lg:mt-10">
          <BlogCard post={post} variant="featured" />
        </div>
      </Container>
    </section>
  );
}
