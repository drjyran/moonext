import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, ClipboardList, HardHat, ShieldCheck } from "lucide-react";
import { HomeImageSlider } from "@/components/public/home-image-slider";
import { SectionHeading } from "@/components/public/section-heading";
import { getCurrentUserFromCookie } from "@/lib/auth";
import {
  auditedFinancialDetail,
  auditedFinancialSummary,
  companyHighlights,
  complianceHighlights,
  heroStats,
  legalIdentity,
  whyChooseMoonext
} from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Moonext Constructions Pvt Ltd delivers construction, civil execution, workforce coordination, and secure staff access to its labour management platform."
};

const operationalStrengths = [
  {
    title: "Execution Discipline",
    description: "Field coordination, reporting rhythm, and project visibility designed for real site conditions.",
    icon: Building2
  },
  {
    title: "Workforce Control",
    description: "Structured labour attendance, payment visibility, and site manpower oversight through the internal portal.",
    icon: HardHat
  },
  {
    title: "Commercial Clarity",
    description: "Operational data that helps contractors, site teams, and management make faster decisions.",
    icon: ClipboardList
  }
];

export default async function HomePage() {
  const user = await getCurrentUserFromCookie();
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;
  const homeHero = websiteContent.homeHero;
  const services = websiteContent.services;
  const projects = websiteContent.projects;
  const staffHref = user ? "/dashboard" : "/staff-access";
  const staffLabel = user ? "Open Dashboard" : "Staff Login";
  const featuredProjects = (() => {
    const selectedProjects = projects.filter((project) => project.featured).slice(0, 3);
    return selectedProjects.length > 0 ? selectedProjects : projects.slice(0, 3);
  })();
  const featuredServices = services.slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name,
    description: companyInfo.description,
    telephone: companyInfo.phone[0],
    email: companyInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${companyInfo.officeAddress[0]}, ${companyInfo.officeAddress[1]}`,
      addressLocality: "Ramnagar",
      addressRegion: "Bihar",
      postalCode: "845106",
      addressCountry: "IN"
    },
    url: "https://moonext.vercel.app"
  };

  return (
    <main className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#09111f_0%,#0d1d34_42%,#1f3d70_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="public-container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <div className="space-y-7">
            <span className="public-tag">{companyInfo.name}</span>
            <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              <span>Bihar Based Company</span>
              <span className="h-1 w-1 self-center rounded-full bg-white/30" />
              <span>CIN {companyInfo.cin}</span>
            </div>
            <div className="space-y-5">
              <h1 className="public-display max-w-4xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl md:text-7xl">
                {homeHero.headline}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                {homeHero.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.32)] transition hover:brightness-105"
              >
                Get a Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Services
              </Link>
              <Link
                href={staffHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {staffLabel}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {operationalStrengths.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                      <Icon size={20} />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5">
            <HomeImageSlider slides={homeHero.slides} />

            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.16)] backdrop-blur-xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Construction Capability</p>
              <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight text-white">Execution systems that support field delivery.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[22px] border border-white/10 bg-slate-950/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/42 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moonext-orange text-white">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Internal Operations</p>
                  <p className="text-lg font-semibold text-white">Labour Management Portal</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-200">
                Authorized staff can securely access the existing labour management dashboard for attendance, wage,
                settlement, and workforce reporting without leaving the company website.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="public-container grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm">
              <p className="text-3xl font-semibold text-slate-950">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Company Overview"
            title="Built for disciplined project execution and stronger workforce operations."
            description={companyInfo.description}
          />

          <div className="grid gap-4">
            {companyHighlights.map((item) => (
              <div key={item} className="public-panel flex items-start gap-4 p-5 sm:p-6">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-moonext-navy text-white">
                  <ArrowRight size={18} />
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container">
          <SectionHeading
            eyebrow="Our Services"
            title="Construction support designed around delivery, supervision, and labour-intensive execution."
            description="Moonext’s services are structured to support practical site realities, project timelines, and disciplined workforce coordination."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredServices.map((service) => (
              <article key={service.slug} className="public-panel group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1f3d70_100%)] text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)]">
                  {service.icon}
                </div>
                <h3 className="public-display mt-6 text-[1.7rem] font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-moonext-navy transition group-hover:gap-3 hover:text-blue-900"
                >
                  Learn More
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Project support across residential, commercial, and infrastructure work."
            description="Moonext showcases construction capability through site execution support, labour visibility, and project-focused coordination."
            align="center"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.slug} className="group overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/88 shadow-[0_22px_65px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(15,23,42,0.14)]">
                <div className="relative h-64">
                  <Image src={project.image} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.26))]" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <span>{project.category}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{project.status}</span>
                  </div>
                  <div>
                    <h3 className="public-display text-3xl font-semibold text-slate-950">{project.title}</h3>
                    <p className="mt-1 text-sm font-medium text-moonext-navy">{project.location}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{project.description}</p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition hover:bg-slate-700"
                  >
                    View Project
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container">
          <SectionHeading
            eyebrow="Company At A Glance"
            title="Audited financial track record aur legal transparency."
            description={auditedFinancialDetail.positioningLine}
            align="center"
          />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-950 text-white">
                    <th className="px-6 py-4 font-semibold">Financial Year</th>
                    <th className="px-6 py-4 font-semibold">Revenue</th>
                    <th className="px-6 py-4 font-semibold">PBT</th>
                    <th className="px-6 py-4 font-semibold">PAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditedFinancialSummary.map((row) => (
                    <tr key={row.fy}>
                      <td className="px-6 py-4 font-semibold text-slate-950">{row.fy}</td>
                      <td className="px-6 py-4 text-slate-700">{row.revenue}</td>
                      <td className="px-6 py-4 text-slate-700">{row.pbt}</td>
                      <td className="px-6 py-4 text-slate-700">{row.pat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">Legal: {legalIdentity.legalName} | CIN {legalIdentity.cin}</div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">{complianceHighlights[0]}</div>
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">{auditedFinancialDetail.cautionLine}</div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/company-profile" className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white">View Full Company Profile</Link>
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-950 text-white">
        <div className="public-container">
          <SectionHeading
            eyebrow="Why Choose Moonext"
            title="Trust built through disciplined site control and clear workforce systems."
            description="The company website and internal portal work together to show both market-facing capability and operational seriousness."
            invert
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseMoonext.map((item) => (
              <div key={item.title} className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                <h3 className="public-display text-[1.75rem] font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container grid gap-6 lg:grid-cols-2">
          <div className="public-panel bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10">
              <ShieldCheck size={24} />
            </div>
            <h2 className="public-display mt-6 text-4xl font-semibold">Safety and quality are treated as delivery fundamentals.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Moonext supports safer execution, clearer documentation, and cleaner reporting standards so project teams
              can monitor progress with more confidence.
            </p>
          </div>

          <div className="public-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Internal Workforce Management</p>
            <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight text-slate-950">Secure staff access to the Labour Management System.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The existing Moonext labour portal remains fully intact. Staff can use the company website to reach the
              current dashboard for labour attendance, payroll, settlements, materials, and site-level reporting.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={staffHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
              >
                {user ? "Go To Dashboard" : "Access Staff Portal"}
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition hover:bg-slate-50"
              >
                Request Project Discussion
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_100%)] px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Let’s Build With Clarity</p>
                <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                  Talk to Moonext about construction execution, workforce planning, or project support requirements.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
                >
                  Contact Us
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
