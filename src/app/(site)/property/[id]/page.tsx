import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyPageContent } from "@/components/property/PropertyPageContent";
import { getStoreConfig } from "@/lib/store-config.server";
import {
  getGalleryImages,
  getPropertyById,
  getPropertyJsonLd,
  getSeoDescription,
} from "@/lib/property-helpers";
import { getPropertyFallbackPools } from "@/lib/image-slots";
import { getPublicPropertyIds } from "@/lib/properties";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

async function getShareUrl(id: string): Promise<string> {
  return `/property/${id}`;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: "Объект не найден — AGMERZ ESTATE" };
  }

  const description = getSeoDescription(property);
  const fallbackPools = await getPropertyFallbackPools();
  const images = getGalleryImages(property, fallbackPools);
  const title = `${property.title} — AGMERZ ESTATE`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: images[0] ? [{ url: images[0], alt: property.title }] : [],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property || property.status === "draft") {
    notFound();
  }

  const shareUrl = await getShareUrl(id);
  const jsonLd = getPropertyJsonLd(property, shareUrl);
  const config = await getStoreConfig();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyPageContent property={property} shareUrl={shareUrl} config={config} />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const ids = await getPublicPropertyIds();
    return ids.map((id) => ({ id }));
  } catch {
    return [];
  }
}
