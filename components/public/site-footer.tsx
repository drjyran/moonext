import Link from "next/link";
import { navigationLinks, socialPlaceholders } from "@/lib/company-content";
import type { CompanyInfoContent, ServiceContent } from "@/lib/website-content";

type Props = {
  companyInfo: CompanyInfoContent;
  services: ServiceContent[];
};

export function SiteFooter({ companyInfo, services }: Props) {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/30 bg-[linear-gradient(135deg,#07111f_0%,#0f1c32_48%,#10284a_100%)] text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-10 flex flex-col gap-5 rounded-[32px] border border-white/10 bg-white/5 px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-200">Premium Project Execution</p>
            <h2 className="public-display mt-4 text-3xl font-semibold text-white md:text-4xl">
              Bring Moonext into your next construction, electrical, or workforce-intensive project.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
            >
              Request A Quote
            </Link>
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Projects
            </Link>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.15fr,0.7fr,0.8fr,0.8fr,0.7fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/15 bg-white text-sm font-black tracking-[0.2em] text-moonext-navy shadow-[0_14px_32px_rgba(255,255,255,0.08)]">
                M
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">Moonext Corporate Site</p>
                <p className="public-display text-xl font-semibold text-white">{companyInfo.shortName}</p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-400">{companyInfo.description}</p>

            <div className="space-y-1 text-sm text-slate-400">
              <p>Legal: MOONEXT CONSTRUCTIONS PRIVATE LIMITED</p>
              <p>CIN: {companyInfo.cin}</p>
              <p>Regd. Office: Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106</p>
              <p>Auditor: Murmuria & Associates, Chartered Accountants, Kolkata</p>
              <p>{companyInfo.phone.join(" / ")}</p>
              <p>{companyInfo.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Quick Links</h3>
            <div className="mt-4 grid gap-2 text-sm">
              {navigationLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-slate-400 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/staff-access" className="text-slate-400 transition hover:text-white">
                Staff Access
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Services</h3>
            <div className="mt-4 grid gap-2 text-sm">
              {services.slice(0, 5).map((service) => (
                <Link key={service.slug} href="/services" className="text-slate-400 transition hover:text-white">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div>
                {companyInfo.officeAddress.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div>
                {companyInfo.hours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Social</h3>
            <div className="mt-4 grid gap-2 text-sm">
              {socialPlaceholders.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
          <p>Built for public company presentation and secure staff portal access.</p>
        </div>
      </div>
    </footer>
  );
}
