import "server-only";

import { Prisma, WebsiteContentSection } from "@prisma/client";
import { cache } from "react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  defaultCompanyInfoContent,
  defaultGalleryContent,
  defaultHomeHeroContent,
  defaultLeadershipContent,
  defaultProjectContent,
  defaultServiceContent,
  defaultWebsiteContent,
  sortByOrder,
  type CompanyInfoContent,
  type GalleryItemContent,
  type HomeHeroContent,
  type LeadershipMemberContent,
  type ProjectContent,
  type PublicWebsiteContent,
  type ServiceContent,
  type WebsiteSectionKey
} from "@/lib/website-content";

const phoneSchema = z.string().trim().min(5).max(20);
const nonEmptyString = z.string().trim().min(1);

const companyInfoSchema = z.object({
  name: nonEmptyString,
  shortName: nonEmptyString,
  legalName: z.string().trim().min(1).optional(),
  tagline: nonEmptyString,
  description: nonEmptyString,
  phone: z.tuple([phoneSchema, phoneSchema]),
  whatsappNumber: z.string().trim().min(10),
  email: z.string().trim().email(),
  officeAddress: z.tuple([nonEmptyString, nonEmptyString, nonEmptyString]),
  registeredOffice: z.string().trim().min(1).optional(),
  statutoryAuditor: z.string().trim().min(1).optional(),
  cin: nonEmptyString,
  hours: z.tuple([nonEmptyString, nonEmptyString])
});

const heroSlideSchema = z.object({
  eyebrow: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
  image: nonEmptyString,
  sortOrder: z.number().int().min(1)
});

const homeHeroSchema = z.object({
  headline: nonEmptyString,
  description: nonEmptyString,
  slides: z.array(heroSlideSchema).min(1)
});

const leadershipSchema = z.array(
  z.object({
    name: nonEmptyString,
    role: nonEmptyString,
    description: nonEmptyString,
    image: nonEmptyString,
    sortOrder: z.number().int().min(1)
  })
);

const serviceSchema = z.array(
  z.object({
    slug: nonEmptyString,
    title: nonEmptyString,
    shortDescription: nonEmptyString,
    description: nonEmptyString,
    icon: nonEmptyString.max(8),
    bullets: z.array(nonEmptyString).min(1),
    sortOrder: z.number().int().min(1)
  })
);

const projectSchema = z.array(
  z.object({
    slug: nonEmptyString,
    title: nonEmptyString,
    clientName: z.string().trim().optional(),
    location: nonEmptyString,
    category: nonEmptyString,
    clientCategory: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    status: nonEmptyString,
    description: nonEmptyString,
    summary: nonEmptyString,
    image: nonEmptyString,
    year: nonEmptyString,
    metrics: z.array(nonEmptyString).min(1),
    scopeOfWork: z.array(nonEmptyString).optional(),
    keyHighlights: z.array(nonEmptyString).optional(),
    safetyCommitment: z.string().trim().optional(),
    featured: z.boolean().optional(),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
    sortOrder: z.number().int().min(1)
  })
);

const gallerySchema = z.array(
  z.object({
    title: nonEmptyString,
    image: nonEmptyString,
    category: nonEmptyString,
    sortOrder: z.number().int().min(1)
  })
);

const sectionMap: Record<WebsiteSectionKey, WebsiteContentSection> = {
  companyInfo: WebsiteContentSection.COMPANY_INFO,
  homeHero: WebsiteContentSection.HOME_HERO,
  services: WebsiteContentSection.SERVICES,
  projects: WebsiteContentSection.PROJECTS,
  galleryItems: WebsiteContentSection.GALLERY,
  leadershipTeam: WebsiteContentSection.LEADERSHIP
};

const sectionFromEnum = new Map<WebsiteContentSection, WebsiteSectionKey>(
  Object.entries(sectionMap).map(([key, value]) => [value, key as WebsiteSectionKey])
);

function isWebsiteContentTableMissing(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2021" || error.code === "P2022");
}

function parseSectionValue(key: "companyInfo", value: unknown): CompanyInfoContent;
function parseSectionValue(key: "homeHero", value: unknown): HomeHeroContent;
function parseSectionValue(key: "services", value: unknown): ServiceContent[];
function parseSectionValue(key: "projects", value: unknown): ProjectContent[];
function parseSectionValue(key: "galleryItems", value: unknown): GalleryItemContent[];
function parseSectionValue(key: "leadershipTeam", value: unknown): LeadershipMemberContent[];
function parseSectionValue(key: WebsiteSectionKey, value: unknown): PublicWebsiteContent[WebsiteSectionKey];
function parseSectionValue(key: WebsiteSectionKey, value: unknown) {
  switch (key) {
    case "companyInfo": {
      const parsed = companyInfoSchema.parse(value);
      return parsed;
    }
    case "homeHero": {
      const parsed = homeHeroSchema.parse(value);
      return {
        ...parsed,
        slides: sortByOrder(parsed.slides)
      };
    }
    case "services":
      return sortByOrder(serviceSchema.parse(value));
    case "projects":
      return sortByOrder(projectSchema.parse(value));
    case "galleryItems":
      return sortByOrder(gallerySchema.parse(value));
    case "leadershipTeam":
      return sortByOrder(leadershipSchema.parse(value));
    default:
      throw new Error(`Unsupported section: ${String(key)}`);
  }
}

async function readWebsiteContentRows() {
  try {
    return await prisma.websiteContent.findMany();
  } catch (error) {
    if (isWebsiteContentTableMissing(error)) {
      return [];
    }
    throw error;
  }
}

function mergeProjectContent(projects: ProjectContent[]) {
  const defaultBySlug = new Map(defaultProjectContent.map((project) => [project.slug, project]));
  const mergedProjects = projects.map((project) => {
    const fallback = defaultBySlug.get(project.slug);
    if (!fallback) {
      return project;
    }

    return {
      ...fallback,
      ...project,
      clientName: project.clientName || fallback.clientName,
      clientCategory: project.clientCategory || fallback.clientCategory,
      industry: project.industry || fallback.industry,
      metrics: project.metrics.length > 0 ? project.metrics : fallback.metrics,
      scopeOfWork: project.scopeOfWork && project.scopeOfWork.length > 0 ? project.scopeOfWork : fallback.scopeOfWork,
      keyHighlights:
        project.keyHighlights && project.keyHighlights.length > 0 ? project.keyHighlights : fallback.keyHighlights,
      safetyCommitment: project.safetyCommitment || fallback.safetyCommitment,
      featured: project.featured ?? fallback.featured,
      seoTitle: project.seoTitle || fallback.seoTitle,
      seoDescription: project.seoDescription || fallback.seoDescription
    };
  });

  let nextSortOrder = Math.max(0, ...mergedProjects.map((project) => project.sortOrder));
  const presentSlugs = new Set(mergedProjects.map((project) => project.slug));

  for (const project of defaultProjectContent) {
    if (presentSlugs.has(project.slug)) {
      continue;
    }

    nextSortOrder += 1;
    mergedProjects.push({
      ...project,
      sortOrder: nextSortOrder
    });
  }

  return sortByOrder(mergedProjects);
}

function mergeWithDefaults(rows: { section: WebsiteContentSection; value: Prisma.JsonValue }[]): PublicWebsiteContent {
  const content: PublicWebsiteContent = {
    ...defaultWebsiteContent,
    companyInfo: defaultCompanyInfoContent,
    homeHero: defaultHomeHeroContent,
    services: defaultServiceContent,
    projects: defaultProjectContent,
    galleryItems: defaultGalleryContent,
    leadershipTeam: defaultLeadershipContent
  };

  for (const row of rows) {
    const key = sectionFromEnum.get(row.section);
    if (!key) continue;

    try {
      switch (key) {
        case "companyInfo":
          content.companyInfo = parseSectionValue("companyInfo", row.value);
          break;
        case "homeHero":
          content.homeHero = parseSectionValue("homeHero", row.value);
          break;
        case "services":
          content.services = parseSectionValue("services", row.value);
          break;
        case "projects":
          content.projects = mergeProjectContent(parseSectionValue("projects", row.value));
          break;
        case "galleryItems":
          content.galleryItems = parseSectionValue("galleryItems", row.value);
          break;
        case "leadershipTeam":
          content.leadershipTeam = parseSectionValue("leadershipTeam", row.value);
          break;
      }
    } catch (error) {
      console.error(`Invalid website content stored for section ${key}:`, error);
    }
  }

  return content;
}

export const getWebsiteContentForAdmin = cache(async () => {
  const rows = await readWebsiteContentRows();
  return mergeWithDefaults(rows);
});

export const getPublicWebsiteContent = cache(async () => {
  const content = await getWebsiteContentForAdmin();
  return content;
});

export async function saveWebsiteSection(section: WebsiteSectionKey, value: unknown) {
  const parsed = parseSectionValue(section, value);

  try {
    await prisma.websiteContent.upsert({
      where: { section: sectionMap[section] },
      update: {
        value: parsed as Prisma.InputJsonValue
      },
      create: {
        section: sectionMap[section],
        value: parsed as Prisma.InputJsonValue
      }
    });
  } catch (error) {
    if (isWebsiteContentTableMissing(error)) {
      throw new Error("Website content table is not available yet. Run the latest Prisma migration first.");
    }
    throw error;
  }

  return parsed;
}
