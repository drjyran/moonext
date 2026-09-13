"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";
import type { CompanyInfoContent, ServiceContent } from "@/lib/website-content";

type ShellUser = {
  fullName: string;
  role: string;
} | null;

type Props = {
  children: React.ReactNode;
  user: ShellUser;
  companyInfo: CompanyInfoContent;
  services: ServiceContent[];
};

function isInternalRoute(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/reports/payroll";
}

export function SiteShell({ children, user, companyInfo, services }: Props) {
  const pathname = usePathname();
  const hiddenChrome = isInternalRoute(pathname);

  if (hiddenChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader companyInfo={companyInfo} user={user} isInternalRoute={false} />
      <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.15),rgba(248,245,239,0.4))]">
        {children}
      </div>
      <WhatsAppFloat whatsappNumber={companyInfo.whatsappNumber} />
      <SiteFooter companyInfo={companyInfo} services={services} />
    </>
  );
}
