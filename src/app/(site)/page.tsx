import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryCards } from "@/components/home/CategoryCards";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyAgmerz } from "@/components/home/WhyAgmerz";
import { CtaBanner } from "@/components/home/CtaBanner";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ContactCta } from "@/components/home/ContactCta";
import { getFeaturedProperties } from "@/lib/properties";
import { getPublishedPosts } from "@/lib/blog";
import { getPublishedReviews } from "@/lib/reviews";
import { getStoreConfig } from "@/lib/store-config.server";
import { getHomepageConfig } from "@/lib/homepage";
import { getCategoryCardsData } from "@/lib/category-images.server";

export const metadata: Metadata = {
  title: "AGMERZ ESTATE — Недвижимость",
  description:
    "AGMERZ ESTATE — подбор, продажа и аренда недвижимости. Найдите недвижимость, которая подходит именно вам.",
};

export default async function HomePage() {
  const [blogPosts, featuredProperties, reviews, config, homepage, categories] = await Promise.all([
    getPublishedPosts(),
    getFeaturedProperties(3),
    getPublishedReviews(),
    getStoreConfig(),
    getHomepageConfig(),
    getCategoryCardsData(),
  ]);

  return (
    <>
      <HeroSection hero={homepage.hero} />
      <CategoryCards categories={categories} />
      {homepage.featured.enabled && <FeaturedProperties properties={featuredProperties} />}
      <WhyAgmerz />
      <CtaBanner />
      <AboutPreview aboutSection={homepage.aboutSection} />
      <ReviewsSection reviews={reviews} />
      <BlogPreview posts={blogPosts.slice(0, 3)} />
      <ContactCta config={config} contactCta={homepage.contactCta} />
    </>
  );
}
