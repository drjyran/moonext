import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, ClipboardList, HardHat, ShieldCheck } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { HomeAnimations } from "@/components/public/home-animations";
import { HomeImageSlider } from "@/components/public/home-image-slider";
import { Reveal } from "@/components/public/reveal";
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
      <HomeAnimations>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1026_0%,#1e1b4b_30%,#4c1d95_58%,#be185d_100%)] text-white">
        <FloatingOrbs count={6} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.24),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-gradient-to-br from-orange-400/20 to-pink-500/20 blur-3xl float-animation" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/15 to-blue-500/15 blur-3xl float-animation" style={{ animationDelay: '2s' }} />
        <div className="public-container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <div className="space-y-7">
            <Reveal>
              <span className="public-tag animate-pop-in">{companyInfo.name}</span>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                <span>Bihar Based Company</span>
                <span className="h-1 w-1 self-center rounded-full bg-white/30" />
                <span>CIN {companyInfo.cin}</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="space-y-5">
                <h1 className="public-display max-w-4xl animate-gradient-pan bg-[linear-gradient(90deg,#fecdd3,#fdba74,#fcd34d,#a7f3d0,#93c5fd,#c4b5fd,#fecdd3)] bg-[length:220%_100%] bg-clip-text text-5xl font-semibold leading-[0.95] text-transparent sm:text-6xl md:text-7xl">
                  {homeHero.headline}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-rose-100 md:text-lg">
                  {homeHero.description}
                </p>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="lively-button inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f97316_50%,#8b5cf6_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,63,94,0.36)]"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/services"
                  className="lively-button inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Explore Services
                </Link>
                <Link
                  href={staffHref}
                  className="lively-button inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {staffLabel}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div className="grid gap-4 sm:grid-cols-3">
                {operationalStrengths.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="lively-card rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-md">
                      <div className="flex h-11 w-11 animate-float-slow items-center justify-center rounded-2xl bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                        <Icon size={20} />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-rose-100">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-5">
            <Reveal delay={2}><HomeImageSlider slides={homeHero.slides} /></Reveal>

            <Reveal delay={3}>
            <div className="lively-card rounded-[32px] border border-white/15 bg-white/12 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">Construction Capability</p>
              <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight text-white">Execution systems that support field delivery.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat, index) => (
                  <div key={stat.label} className="lively-card rounded-[22px] border border-white/15 bg-slate-950/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <p className="animate-[float-slow_5s_ease-in-out_infinite] text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-rose-100">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            </Reveal>

            <Reveal delay={3}>
            <div className="lively-card rounded-[28px] border border-white/15 bg-slate-950/45 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 animate-float-fast items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-white shadow-[0_10px_24px_rgba(251,113,133,0.32)]">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-200">Internal Operations</p>
                  <p className="text-lg font-semibold text-white">Labour Management Portal</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-rose-100">
                Authorized staff can securely access the existing labour management dashboard for attendance, wage,
                settlement, and workforce reporting without leaving the company website.
              </p>
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-violet-200/40 bg-[linear-gradient(100deg,#fdf2f8_0%,#fef3c7_25%,#d1fae5_50%,#e0f2fe_75%,#f5f3ff_100%)]">
        <div className="public-container grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((stat, index) => (
            <Reveal key={stat.label} delay={(index % 4) as 0 | 1 | 2 | 3}>
              <div className="lively-card rounded-[28px] border border-violet-200/50 bg-white/90 p-5 shadow-[0_18px_45px_rgba(124,58,237,0.10)] backdrop-blur-sm">
                <p className="animate-[float-slow_6s_ease-in-out_infinite] text-3xl font-semibold bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#fef3c7_0%,#fdf2f8_50%,#f5f3ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Why Choose Moonext"
            title="Built for disciplined project execution and stronger workforce operations."
            description="We combine construction expertise with modern technology to deliver projects on time and within budget."
            tone="orange"
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseMoonext.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2}>
                <div className="lively-card card-shine group rounded-[32px] border border-amber-200/60 bg-white/90 p-7 shadow-[0_22px_65px_rgba(245,158,11,0.12)] backdrop-blur-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-[0_12px_30px_rgba(245,158,11,0.35)] icon-bounce">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-5 public-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Company Overview"
            title="Built for disciplined project execution and stronger workforce operations."
            description={companyInfo.description}
            tone="rose"
          />

          <div className="grid gap-4">
            {companyHighlights.map((item, index) => (
              <Reveal key={item} delay={(index % 3) as 0 | 1 | 2}>
                <div className="public-panel lively-card flex items-start gap-4 p-5 sm:p-6">
                  <div className="mt-1 flex h-10 w-10 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-white shadow-[0_8px_20px_rgba(244,63,94,0.24)]">
                    <ArrowRight size={18} />
                  </div>
                  <p className="text-sm leading-7 text-slate-600 sm:text-base">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#fef3c7_0%,#fefce8_35%,#ecfdf5_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Our Services"
            title="Construction support designed around delivery, supervision, and labour-intensive execution."
            description="Moonext’s services are structured to support practical site realities, project timelines, and disciplined workforce coordination."
            tone="emerald"
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredServices.map((service, index) => (
              <Reveal key={service.slug} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <article className="public-panel lively-card group flex h-full flex-col">
                  <div className="flex h-14 w-14 animate-float-slow items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_45%,#10b981_100%)] text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_35px_rgba(244,63,94,0.26)]">
                    {service.icon}
                  </div>
                  <h3 className="public-display mt-6 text-[1.7rem] font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-rose-600 to-emerald-500 bg-clip-text text-transparent transition group-hover:gap-3"
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#e0f2fe_0%,#eef9ff_40%,#f5f3ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Project support across residential, commercial, and infrastructure work."
            description="Moonext showcases construction capability through site execution support, labour visibility, and project-focused coordination."
            tone="sky"
            align="center"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.slug} delay={(index % 3) as 0 | 1 | 2}>
                <article className="lively-card group overflow-hidden rounded-[32px] border border-sky-200/60 bg-white/90 shadow-[0_22px_65px_rgba(14,165,233,0.12)] backdrop-blur-sm">
                  <div className="relative h-64">
                    <Image src={project.image} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(99,102,241,0.02),rgba(124,58,237,0.22))]" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                      <span>{project.category}</span>
                      <span className="h-1 w-1 rounded-full bg-indigo-300" />
                      <span>{project.status}</span>
                    </div>
                    <div>
                      <h3 className="public-display text-3xl font-semibold text-slate-950">{project.title}</h3>
                      <p className="mt-1 text-sm font-medium bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">{project.location}</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{project.description}</p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="lively-button inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6366f1_0%,#0ea5e9_55%,#10b981_100%)] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(99,102,241,0.30)]"
                    >
                      View Project
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#f5f3ff_0%,#fdf4ff_45%,#fef2f2_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Company At A Glance"
            title="Audited financial track record aur legal transparency."
            description={auditedFinancialDetail.positioningLine}
            tone="violet"
            align="center"
          />
          <Reveal>
          <div className="mt-10 overflow-hidden rounded-[28px] border border-violet-200/60 bg-white shadow-[0_20px_55px_rgba(139,92,246,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_60%,#db2777_100%)] text-white">
                    <th className="px-6 py-4 font-semibold">Financial Year</th>
                    <th className="px-6 py-4 font-semibold">Revenue</th>
                    <th className="px-6 py-4 font-semibold">PBT</th>
                    <th className="px-6 py-4 font-semibold">PAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet-100">
                  {auditedFinancialSummary.map((row) => (
                    <tr key={row.fy} className="transition duration-200 hover:bg-violet-50">
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
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Reveal delay={1}><div className="lively-card rounded-[24px] border border-violet-200/60 bg-white p-5 text-sm leading-6 text-slate-600">Legal: {legalIdentity.legalName} | CIN {legalIdentity.cin}</div></Reveal>
            <Reveal delay={2}><div className="lively-card rounded-[24px] border border-sky-200/60 bg-white p-5 text-sm leading-6 text-slate-600">{complianceHighlights[0]}</div></Reveal>
            <Reveal delay={3}><div className="lively-card rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">{auditedFinancialDetail.cautionLine}</div></Reveal>
          </div>
          <div className="mt-6 text-center">
            <Reveal delay={3}>
              <Link href="/company-profile" className="lively-button inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_55%,#0ea5e9_100%)] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(124,58,237,0.32)]">View Full Company Profile</Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(160deg,#4c1d95_0%,#6d28d9_35%,#9d174d_70%,#be185d_100%)] text-white">
        <div className="public-container">
          <SectionHeading
            eyebrow="Why Choose Moonext"
            title="Trust built through disciplined site control and clear workforce systems."
            description="The company website and internal portal work together to show both market-facing capability and operational seriousness."
            tone="violet"
            invert
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseMoonext.map((item, index) => (
              <Reveal key={item.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <div className="lively-card rounded-[30px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_50px_rgba(124,58,237,0.24)] backdrop-blur-md">
                  <div className="flex h-11 w-11 animate-float-slow items-center justify-center rounded-2xl bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                    🏗
                  </div>
                  <h3 className="public-display mt-4 text-[1.75rem] font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-fuchsia-100">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(100deg,#fdf2f8_0%,#fef3c7_35%,#d1fae5_100%)]">
        <div className="public-container grid gap-6 lg:grid-cols-2">
          <Reveal delay={1}>
          <div className="lively-card rounded-[30px] border border-rose-200/70 bg-[linear-gradient(150deg,#ffe4e6_0%,#fecdd3_45%,#fda4af_100%)] p-8 text-rose-950 shadow-[0_24px_70px_rgba(244,63,94,0.16)]">
            <div className="flex h-14 w-14 animate-float-fast items-center justify-center rounded-3xl bg-white/40 text-rose-500 shadow-[0_10px_25px_rgba(244,63,94,0.24)]">
              <ShieldCheck size={24} />
            </div>
            <h2 className="public-display mt-6 text-3xl font-semibold">Safety and quality are treated as delivery fundamentals.</h2>
            <p className="mt-4 text-sm leading-7 text-rose-900">
              Moonext supports safer execution, clearer documentation, and cleaner reporting standards so project teams
              can monitor progress with more confidence.
            </p>
          </div>
          </Reveal>

          <Reveal delay={2}>
          <div className="lively-card rounded-[30px] border border-emerald-200/70 bg-[linear-gradient(150deg,#ecfdf5_0%,#d1fae5_40%,#99f6e4_100%)] p-8 text-emerald-950 shadow-[0_24px_70px_rgba(16,185,129,0.16)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Internal Workforce Management</p>
            <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight">Secure staff access to the Labour Management System.</h2>
            <p className="mt-4 text-sm leading-7 text-emerald-900">
              The existing Moonext labour portal remains fully intact. Staff can use the company website to reach the
              current dashboard for labour attendance, payroll, settlements, materials, and site-level reporting.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={staffHref}
                className="lively-button inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#10b981_0%,#14b8a6_55%,#0ea5e9_100%)] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(16,185,129,0.32)]"
              >
                {user ? "Go To Dashboard" : "Access Staff Portal"}
              </Link>
              <Link
                href="/contact"
                className="lively-button inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300 bg-white/80 px-5 text-sm font-semibold text-emerald-900 shadow-[0_10px_25px_rgba(16,185,129,0.10)]"
              >
                Request Project Discussion
              </Link>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(100deg,#4c1d95_0%,#7c3aed_45%,#db2777_75%,#f97316_100%)]">
        <div className="public-container">
          <div className="lively-card rounded-[34px] border border-white/20 bg-white/12 px-6 py-10 text-white shadow-[0_30px_90px_rgba(124,58,237,0.28)] backdrop-blur-xl md:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="animate-gradient-pan bg-[linear-gradient(90deg,#ffd1dc,#ffd6a5,#bfe6d5,#bfdbfe,#ddd6fe,#ffd1dc)] bg-[length:220%_100%] bg-clip-text text-xs font-semibold uppercase tracking-[0.3em] text-transparent">Let’s Build With Clarity</p>
                <h2 className="public-display mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                  Talk to Moonext about construction execution, workforce planning, or project support requirements.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="lively-button inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(244,63,94,0.32)]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/projects"
                  className="lively-button inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </HomeAnimations>
    </main>
  );
}
