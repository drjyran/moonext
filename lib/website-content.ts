import { companyInfo, galleryItems, homeHeroSlides, leadershipTeam, projects, services } from "@/lib/company-content";

export type CompanyInfoContent = {
  name: string;
  shortName: string;
  legalName?: string;
  tagline: string;
  description: string;
  phone: [string, string];
  whatsappNumber: string;
  email: string;
  officeAddress: [string, string, string];
  registeredOffice?: string;
  statutoryAuditor?: string;
  cin: string;
  hours: [string, string];
};

export type HomeHeroSlideContent = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type HomeHeroContent = {
  headline: string;
  description: string;
  slides: HomeHeroSlideContent[];
};

export type LeadershipMemberContent = {
  name: string;
  role: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type ServiceContent = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  bullets: string[];
  sortOrder: number;
};

export type ProjectContent = {
  slug: string;
  title: string;
  clientName?: string;
  location: string;
  category: string;
  clientCategory?: string;
  industry?: string;
  status: string;
  description: string;
  summary: string;
  image: string;
  year: string;
  metrics: string[];
  scopeOfWork?: string[];
  keyHighlights?: string[];
  safetyCommitment?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
};

export type GalleryItemContent = {
  title: string;
  image: string;
  category: string;
  sortOrder: number;
};

export type WebsiteSectionKey =
  | "companyInfo"
  | "homeHero"
  | "services"
  | "projects"
  | "galleryItems"
  | "leadershipTeam";

export type PublicWebsiteContent = {
  companyInfo: CompanyInfoContent;
  homeHero: HomeHeroContent;
  services: ServiceContent[];
  projects: ProjectContent[];
  galleryItems: GalleryItemContent[];
  leadershipTeam: LeadershipMemberContent[];
};

export const websiteSectionKeys = [
  "companyInfo",
  "homeHero",
  "services",
  "projects",
  "galleryItems",
  "leadershipTeam"
] as const satisfies readonly WebsiteSectionKey[];

export const defaultCompanyInfoContent: CompanyInfoContent = {
  ...companyInfo,
  phone: [companyInfo.phone[0] ?? "", companyInfo.phone[1] ?? ""],
  officeAddress: [
    companyInfo.officeAddress[0] ?? "",
    companyInfo.officeAddress[1] ?? "",
    companyInfo.officeAddress[2] ?? ""
  ],
  hours: [companyInfo.hours[0] ?? "", companyInfo.hours[1] ?? ""]
};

export const defaultHomeHeroContent: HomeHeroContent = {
  headline: "Building projects with site discipline, workforce visibility, and dependable execution.",
  description:
    `${companyInfo.tagline} Moonext Constructions Pvt Ltd supports civil works, labour-intensive execution, and site operations with practical systems built for Indian construction environments.`,
  slides: homeHeroSlides.map((slide, index) => ({
    ...slide,
    sortOrder: index + 1
  }))
};

export const defaultServiceContent: ServiceContent[] = services.map((service, index) => ({
  ...service,
  sortOrder: index + 1
}));

export const defaultProjectContent: ProjectContent[] = projects.map((project, index) => ({
  ...project,
  sortOrder: index + 1
}));

export const defaultGalleryContent: GalleryItemContent[] = galleryItems.map((item, index) => ({
  ...item,
  sortOrder: index + 1
}));

export const defaultLeadershipContent: LeadershipMemberContent[] = leadershipTeam.map((leader, index) => ({
  ...leader,
  sortOrder: index + 1
}));

export const defaultWebsiteContent: PublicWebsiteContent = {
  companyInfo: defaultCompanyInfoContent,
  homeHero: defaultHomeHeroContent,
  services: defaultServiceContent,
  projects: defaultProjectContent,
  galleryItems: defaultGalleryContent,
  leadershipTeam: defaultLeadershipContent
};

export function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}
