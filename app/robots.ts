import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/company-content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/company-profile", "/services", "/projects", "/contact", "/staff-access", "/careers", "/gallery"],
        disallow: ["/dashboard", "/dashboard/", "/api/", "/reports/payroll"]
      }
    ],
    sitemap: `${siteBaseUrl}/sitemap.xml`
  };
}
