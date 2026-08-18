import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogFinalCta } from "@/components/blog/BlogFinalCta";
import { Container } from "@/components/layout/Container";
import {
  getPostBySlug,
  getPostJsonLd,
  getPublishedPosts,
  getRelatedPosts,
} from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Статья не найдена — AGMERZ ESTATE",
    };
  }

  return {
    title: `${post.title} — AGMERZ ESTATE`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
  const jsonLd = getPostJsonLd(post, `/blog/${post.slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <section className="border-b border-border/60 pb-10 pt-10 md:pb-12 md:pt-14">
          <Container>
            <ArticleHeader post={post} />

            {post.coverImage && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl md:mt-10 md:aspect-[21/9]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </Container>
        </section>

        <section className="section-padding pt-10 md:pt-12">
          <Container>
            <ArticleContent post={post} />
          </Container>
        </section>
      </article>

      <RelatedPosts posts={relatedPosts} />
      <BlogFinalCta />
    </>
  );
}
