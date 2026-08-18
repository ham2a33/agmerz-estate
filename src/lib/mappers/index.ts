import type {
  BlogPost,
  Category,
  Client,
  Property,
  Request,
  Review,
  SiteSettings,
} from "@/types";
import type {
  BlogPost as PrismaBlogPost,
  Category as PrismaCategory,
  Client as PrismaClient,
  Property as PrismaProperty,
  PropertyImage,
  Request as PrismaRequest,
  Review as PrismaReview,
  SiteSettings as PrismaSiteSettings,
} from "@prisma/client";
import type { ArticleBlock } from "@/lib/blog-content";

type PropertyWithRelations = PrismaProperty & {
  category: PrismaCategory;
  images: PropertyImage[];
};

export function mapCategory(record: PrismaCategory): Category {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    image: record.image,
    isActive: record.isActive,
    sortOrder: record.sortOrder,
  };
}

export function mapProperty(record: PropertyWithRelations): Property {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    type: record.type,
    category: record.category.slug,
    status: record.status,
    price: record.price,
    currency: record.currency,
    address: record.address,
    district: record.district,
    area: record.area,
    rooms: record.rooms,
    floor: record.floor,
    totalFloors: record.totalFloors,
    yearBuilt: record.yearBuilt,
    description: record.description,
    features: record.features,
    images: record.images.sort((a, b) => a.sortOrder - b.sortOrder).map((image) => image.url),
    coordinates:
      record.lat !== null && record.lng !== null
        ? { lat: record.lat, lng: record.lng }
        : null,
    isFeatured: record.isFeatured,
    featuredOrder: record.featuredOrder,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapClient(record: PrismaClient): Client {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    phone: record.phone,
    email: record.email,
    type: record.type,
    status: record.status,
    notes: record.notes,
    assignedManager: record.assignedManager,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapRequest(record: PrismaRequest): Request {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    email: record.email,
    type: record.type,
    budget: record.budget,
    district: record.district,
    rooms: record.rooms,
    message: record.message,
    internalNotes: record.internalNotes,
    status: record.status,
    clientId: record.clientId,
    propertyId: record.propertyId,
    createdAt: record.createdAt.toISOString(),
  };
}

export function mapSettings(record: PrismaSiteSettings): SiteSettings {
  return {
    agencyName: record.agencyName,
    description: record.description,
    phone: record.phone,
    whatsapp: record.whatsapp,
    email: record.email,
    address: record.address,
    city: record.city,
    workingHours: record.workingHours,
    instagram: record.instagram,
    telegram: record.telegram,
    tiktok: record.tiktok,
    facebook: record.facebook,
    siteTitle: record.siteTitle,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImage: record.ogImage,
    googleAnalyticsId: record.googleAnalyticsId,
    language: record.language,
    currency: record.currency,
    contactPhone: record.contactPhone,
    contactEmail: record.contactEmail,
    contactWhatsapp: record.contactWhatsapp,
    contactAddress: record.contactAddress,
    googleMapsUrl: record.googleMapsUrl,
    leadEmail: record.leadEmail,
    leadWhatsapp: record.leadWhatsapp,
    notificationsEnabled: record.notificationsEnabled,
    defaultRequestStatus: record.defaultRequestStatus,
    logoUrl: record.logoUrl,
    faviconUrl: record.faviconUrl,
  };
}

export function mapReview(record: PrismaReview): Review {
  return {
    id: record.id,
    name: record.name,
    avatar: record.avatar,
    rating: record.rating,
    text: record.text,
    isPublished: record.isPublished,
    createdAt: record.createdAt.toISOString(),
  };
}

export function mapBlogPost(record: PrismaBlogPost): BlogPost {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: record.content,
    coverImage: record.coverImage,
    author: record.author,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    isPublished: record.isPublished,
  };
}

export function getBlogContentBlocks(record: PrismaBlogPost): ArticleBlock[] | null {
  if (!record.contentBlocks) return null;
  return record.contentBlocks as ArticleBlock[];
}

export const propertyInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;
