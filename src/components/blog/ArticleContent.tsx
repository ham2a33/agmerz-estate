import Image from "next/image";
import type { ArticleBlock } from "@/lib/blog";
import { getArticleBlocks, getTableOfContents } from "@/lib/blog";
import type { BlogPost } from "@/types";

interface ArticleContentProps {
  post: BlogPost;
}

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-base leading-[1.85] text-muted md:text-lg">
          {block.text}
        </p>
      );
    case "heading":
      if (block.level === 2) {
        return (
          <h2
            key={index}
            id={block.id}
            className="scroll-mt-28 font-serif text-2xl text-foreground md:text-3xl"
          >
            {block.text}
          </h2>
        );
      }
      return (
        <h3 key={index} id={block.id} className="scroll-mt-28 text-xl font-medium text-foreground md:text-2xl">
          {block.text}
        </h3>
      );
    case "list":
      if (block.ordered) {
        return (
          <ol key={index} className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-muted md:text-lg">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={index} className="space-y-2 text-base leading-relaxed text-muted md:text-lg">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="border-l-2 border-accent/50 pl-5 font-serif text-xl leading-relaxed text-foreground md:text-2xl"
        >
          {block.text}
        </blockquote>
      );
    case "image":
      return (
        <figure key={index} className="overflow-hidden rounded-3xl">
          <div className="relative aspect-[16/10]">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
        </figure>
      );
    default:
      return null;
  }
}

export async function ArticleContent({ post }: ArticleContentProps) {
  const blocks = await getArticleBlocks(post);
  const tableOfContents = getTableOfContents(blocks);

  return (
    <div className={`grid gap-10 lg:gap-16 ${tableOfContents.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
      <article className="mx-auto w-full max-w-[780px] space-y-6 md:space-y-8">
        {blocks.map((block, index) => renderBlock(block, index))}
      </article>

      {tableOfContents.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-border bg-surface p-6">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Содержание</p>
            <ol className="mt-4 space-y-3">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group flex items-start gap-3 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <span className="font-serif text-accent-soft">{item.number}</span>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      )}
    </div>
  );
}
