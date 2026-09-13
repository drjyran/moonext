import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { LoginPanel } from "@/components/public/login-panel";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { readSearchParam, sanitizeRedirectPath, type SearchParamValue } from "@/lib/utils";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

type Props = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export const metadata: Metadata = {
  title: "Staff Login",
  description:
    "Secure login for Moonext Constructions staff to access the Labour Management System dashboard and internal operations portal."
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirectPath(readSearchParam(params.next), "/dashboard");
  const user = await getCurrentUserFromCookie();
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;

  if (user) {
    redirect(redirectTo);
  }

  return (
    <main className="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_52%,#23447b_100%)]">
      <div className="public-container grid gap-10 py-16 md:py-24 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
        <div className="space-y-6 text-white">
          <span className="public-tag">Legacy Login Route</span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Secure access to the Moonext Labour Management System.</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200">
              This page uses the existing Moonext authentication flow. Authorized staff are redirected to the current
              internal dashboard after successful login.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck size={22} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Existing Auth Preserved</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                The staff portal still uses the same routes, cookies, dashboard redirects, and role-aware access.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <SquareArrowOutUpRight size={22} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Need the full portal page?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Use the staff-access page for a richer explanation of how internal users reach the labour portal.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-5 text-sm leading-7 text-slate-200">
            <p><span className="font-semibold text-white">Company:</span> {companyInfo.name}</p>
            <p><span className="font-semibold text-white">Email:</span> {companyInfo.email}</p>
            <p><span className="font-semibold text-white">Phone:</span> {companyInfo.phone.join(" / ")}</p>
            <Link href="/staff-access" className="mt-4 inline-flex items-center gap-2 font-semibold text-orange-200 transition hover:text-white">
              Open Staff Access Page
              <SquareArrowOutUpRight size={16} />
            </Link>
          </div>
        </div>

        <LoginPanel
          title="Moonext Staff Login"
          description="Use your authorized Moonext credentials to access the internal labour and site operations dashboard."
          redirectTo={redirectTo}
          variant="light"
        />
      </div>
    </main>
  );
}
