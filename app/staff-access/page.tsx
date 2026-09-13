import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BriefcaseBusiness, Building2, HardHat, ShieldCheck } from "lucide-react";
import { LoginPanel } from "@/components/public/login-panel";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { staffAccessPhotos } from "@/lib/company-content";
import { readSearchParam, sanitizeRedirectPath, type SearchParamValue } from "@/lib/utils";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

type Props = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export const metadata: Metadata = {
  title: "Staff Access",
  description:
    "Authorized staff can securely access the existing Moonext Labour Management System from this staff portal entry point."
};

const accessRoles = [
  {
    title: "Admin",
    description: "Full operational access for configuration, labour records, wage controls, and reporting."
  },
  {
    title: "Accountant",
    description: "Payment, payroll, settlement, and financial visibility aligned to current role-based permissions."
  },
  {
    title: "Site Manager",
    description: "Daily site operations access for attendance, workforce movement, and execution monitoring."
  },
  {
    title: "HR / Viewer",
    description: "Role-specific visibility for labour records, support workflows, and operational follow-up."
  }
];

export default async function StaffAccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirectPath(readSearchParam(params.next), "/dashboard");
  const user = await getCurrentUserFromCookie();
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;

  if (user) {
    redirect(redirectTo);
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <section className="public-section">
        <div className="public-container grid gap-10 lg:grid-cols-[1.02fr,0.98fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white">
              Authorized Staff Portal
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Staff access to the existing Moonext Labour Management System.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600">
                This portal does not replace the working labour system. It securely connects company staff to the
                current Moonext dashboard so internal teams can continue using the same login, routes, and workflows.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Existing authentication",
                  description: "Current login logic, session cookies, protected dashboard routes, and role-based behavior remain intact.",
                  icon: ShieldCheck
                },
                {
                  title: "Site and workforce operations",
                  description: "Labour, attendance, payroll, materials, reporting, and internal controls stay available after sign-in.",
                  icon: HardHat
                },
                {
                  title: "Construction-facing website",
                  description: "Public visitors see company information while internal users get a dedicated secure access path.",
                  icon: Building2
                },
                {
                  title: "Operational continuity",
                  description: "Dashboard links, APIs, and the database-backed LMS continue to work as before.",
                  icon: BriefcaseBusiness
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="public-panel h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon size={22} />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="public-panel bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Support Information</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
                <p><span className="font-semibold text-white">Company:</span> {companyInfo.name}</p>
                <p><span className="font-semibold text-white">Portal Access Support:</span> {companyInfo.email}</p>
                <p><span className="font-semibold text-white">Phone:</span> {companyInfo.phone.join(" / ")}</p>
              </div>
              <Link href="/contact" className="mt-5 inline-flex text-sm font-semibold text-orange-200 transition hover:text-white">
                Need client-side support instead? Contact Moonext.
              </Link>
            </div>

            <div className="public-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Context</p>
              <div className="mt-5">
                <PagePhotoGrid photos={staffAccessPhotos} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <LoginPanel
              title="Staff Portal Login"
              description="Sign in with your existing Moonext credentials to continue to the internal labour management dashboard."
              redirectTo={redirectTo}
              variant="light"
            />

            <div className="public-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Access Roles</p>
              <div className="mt-5 grid gap-4">
                {accessRoles.map((role) => (
                  <div key={role.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <h2 className="text-base font-semibold text-slate-950">{role.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
