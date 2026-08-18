-- AlterTable
ALTER TABLE "Property" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Property" ADD COLUMN "featuredOrder" INTEGER;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "logoUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "faviconUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "homepageConfig" JSONB;

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "alt" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_isFeatured_featuredOrder_idx" ON "Property"("isFeatured", "featuredOrder");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");
