import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mockProperties } from "../src/lib/mock-data/properties";
import { mockCategories } from "../src/lib/mock-data/categories";
import { mockReviews } from "../src/lib/mock-data/reviews";
import { mockBlogPosts } from "../src/lib/mock-data/blog-posts";
import { articleContents } from "../src/lib/blog-content";
import { DEFAULT_SITE_SETTINGS } from "../src/lib/settings-defaults";

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL ?? "admin@agmerz.ru";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function seedCategories() {
  for (const [index, category] of mockCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.title,
        description: category.description,
        isActive: true,
        sortOrder: index + 1,
      },
      create: {
        id: String(index + 1),
        name: category.title,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isActive: true,
        sortOrder: index + 1,
      },
    });
  }
}

async function seedProperties() {
  for (const property of mockProperties) {
    const category = await prisma.category.findUnique({
      where: { slug: property.category },
    });

    if (!category) {
      throw new Error(`Missing category for property ${property.id}: ${property.category}`);
    }

    await prisma.property.upsert({
      where: { id: property.id },
      update: {
        title: property.title,
        slug: property.slug,
        type: property.type,
        status: property.status,
        price: property.price,
        currency: property.currency,
        address: property.address,
        district: property.district,
        area: property.area,
        rooms: property.rooms,
        floor: property.floor,
        totalFloors: property.totalFloors,
        yearBuilt: property.yearBuilt,
        description: property.description,
        features: property.features,
        lat: property.coordinates?.lat ?? null,
        lng: property.coordinates?.lng ?? null,
        categoryId: category.id,
        createdAt: new Date(property.createdAt),
        updatedAt: new Date(property.updatedAt),
      },
      create: {
        id: property.id,
        title: property.title,
        slug: property.slug,
        type: property.type,
        status: property.status,
        price: property.price,
        currency: property.currency,
        address: property.address,
        district: property.district,
        area: property.area,
        rooms: property.rooms,
        floor: property.floor,
        totalFloors: property.totalFloors,
        yearBuilt: property.yearBuilt,
        description: property.description,
        features: property.features,
        lat: property.coordinates?.lat ?? null,
        lng: property.coordinates?.lng ?? null,
        categoryId: category.id,
        createdAt: new Date(property.createdAt),
        updatedAt: new Date(property.updatedAt),
      },
    });

    await prisma.propertyImage.deleteMany({ where: { propertyId: property.id } });

    if (property.images.length > 0) {
      await prisma.propertyImage.createMany({
        data: property.images.map((url, index) => ({
          propertyId: property.id,
          url,
          sortOrder: index,
        })),
      });
    }
  }
}

async function seedSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      ...DEFAULT_SITE_SETTINGS,
    },
  });
}

async function seedFeaturedProperties() {
  const existingFeatured = await prisma.property.count({ where: { isFeatured: true } });
  if (existingFeatured > 0) return;

  const featured = await prisma.property.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true },
  });

  for (const [index, property] of featured.entries()) {
    await prisma.property.update({
      where: { id: property.id },
      data: {
        isFeatured: true,
        featuredOrder: index + 1,
      },
    });
  }
}

async function seedReviews() {
  for (const review of mockReviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {
        name: review.name,
        avatar: review.avatar,
        rating: review.rating,
        text: review.text,
        isPublished: review.isPublished,
        createdAt: new Date(review.createdAt),
      },
      create: {
        id: review.id,
        name: review.name,
        avatar: review.avatar,
        rating: review.rating,
        text: review.text,
        isPublished: review.isPublished,
        createdAt: new Date(review.createdAt),
      },
    });
  }
}

async function seedBlogPosts() {
  for (const post of mockBlogPosts) {
    const blocks = articleContents[post.slug] ?? [];

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        contentBlocks: blocks,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        isPublished: post.isPublished,
      },
      create: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        contentBlocks: blocks,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        isPublished: post.isPublished,
      },
    });
  }
}

async function main() {
  await seedAdminUser();
  await seedCategories();
  await seedProperties();
  await seedSettings();
  await seedFeaturedProperties();
  await seedReviews();
  await seedBlogPosts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
