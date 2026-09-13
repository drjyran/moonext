-- CreateEnum
CREATE TYPE "WebsiteContentSection" AS ENUM (
  'COMPANY_INFO',
  'HOME_HERO',
  'SERVICES',
  'PROJECTS',
  'GALLERY',
  'LEADERSHIP'
);

-- CreateTable
CREATE TABLE "WebsiteContent" (
  "id" TEXT NOT NULL,
  "section" "WebsiteContentSection" NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContent_section_key" ON "WebsiteContent"("section");
