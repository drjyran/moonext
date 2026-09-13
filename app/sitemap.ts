import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/about", "/company-profile", "/services", "/projects", "/contact", "/staff-access", "/login", "/careers", "/gallery"];
  const { projects } = await getPublicWebsiteContent();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteBaseUrl}${route}`,
      lastModified: now
    })),
    ...projects.map((project) => ({
      url: `${siteBaseUrl}/projects/${project.slug}`,
      lastModified: now
    }))
  ];
}
