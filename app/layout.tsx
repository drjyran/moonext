import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteShell } from "@/components/public/site-shell";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { companyInfo, siteBaseUrl } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: `${companyInfo.name} | Construction & Workforce Operations`,
    template: `%s | ${companyInfo.shortName}`
  },
  description: companyInfo.description,
  keywords: [
    "Moonext Constructions Pvt Ltd",
    "construction company",
    "civil contractor",
    "infrastructure company",
    "labour management construction company",
    "project execution services",
    "construction services in Bihar"
  ],
  openGraph: {
    title: companyInfo.name,
    description: companyInfo.description,
    url: siteBaseUrl,
    siteName: companyInfo.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: companyInfo.name,
    description: companyInfo.description
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserFromCookie();
  const websiteContent = await getPublicWebsiteContent();

  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <SiteShell
          companyInfo={websiteContent.companyInfo}
          services={websiteContent.services}
          user={
            user
              ? {
                  fullName: user.fullName,
                  role: user.role
                }
              : null
          }
        >
          {children}
        </SiteShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
