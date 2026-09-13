import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, HardHat, MapPinned, ShieldCheck, TimerReset } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { servicesPagePhotos } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Moonext Constructions services including building construction, civil contracting, labour supply, site execution support, and project supervision."
};

const serviceSectors = ["Residential Projects", "Commercial Work", "Infrastructure Packages", "Labour-Intensive Sites"];

const serviceApproach = [
  {
    title: "Requirement Review",
    description: "We understand project type, workforce intensity, supervision needs, and site execution conditions.",
    icon: ClipboardCheck
  },
  {
    title: "Resource Alignment",
    description: "Labour, supervision, and reporting responsibilities are aligned to the work package.",
    icon: HardHat
  },
  {
    title: "Field Execution",
    description: "Moonext supports delivery through site coordination, crew discipline, and progress follow-up.",
    icon: MapPinned
  },
  {
    title: "Control and Continuity",
    description: "Structured reporting, issue follow-up, and operational clarity help maintain project flow.",
    icon: TimerReset
  }
];

const assurances = [
  {
    title: "Site-first thinking",
    description: "Services are shaped around real field execution, not generic consulting language.",
    icon: ShieldCheck
  },
  {
    title: "Workforce visibility",
    description: "Labour-intensive assignments are supported with stronger operational tracking and follow-up.",
    icon: HardHat
  },
  {
    title: "Flexible engagement",
    description: "Service discussions can start small and expand into ongoing execution support.",
    icon: ClipboardCheck
  }
];

export default async function ServicesPage() {
  const { services } = await getPublicWebsiteContent();

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0b1026_0%,#1e293b_35%,#065f46_65%,#0ea5e9_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.8fr]">
          <SectionHeading
            eyebrow="Services"
            title="Construction and workforce support tailored to real execution environments."
            description="Moonext delivers services that combine project supervision, labour coordination, civil execution support, and construction-site discipline."
            invert
          />

          <div className="lively-card rounded-[28px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_45px_rgba(6,95,70,0.22)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Service Coverage</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {serviceSectors.map((item, index) => (
                <Reveal key={item} delay={(index % 2) as 0 | 1}>
                <div className="lively-card rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
                  {item}
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#e0f2fe_0%,#eef9ff_45%,#f5f3ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Service Visuals"
            title="Execution services backed by on-site electrical, workforce, and tool-level realities."
            description="The services section now includes project-relevant images so visitors can connect service lines to actual site conditions."
            tone="sky"
            align="center"
          />
          <Reveal delay={1}>
          <div className="mt-12">
            <PagePhotoGrid photos={servicesPagePhotos} />
          </div>
          </Reveal>
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(180deg,#f5f3ff_0%,#fdf2f8_100%)]">
        <div className="public-container grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 2) as 0 | 1}>
            <article key={service.slug} className="lively-card rounded-[30px] border border-violet-200/60 bg-white p-8 shadow-[0_16px_45px_rgba(124,58,237,0.10)]">
              <div className="flex h-14 w-14 animate-float-slow items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_45%,#10b981_100%)] text-sm font-black tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(244,63,94,0.24)]">
                {service.icon}
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-950">{service.title}</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] bg-gradient-to-r from-rose-600 to-emerald-500 bg-clip-text text-transparent">Execution-focused service line</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.bullets.map((bullet) => (
                  <div key={bullet} className="lively-card rounded-2xl border border-violet-200/50 bg-violet-50 px-4 py-3 text-sm text-slate-700">
                    {bullet}
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="lively-button mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6366f1_0%,#0ea5e9_55%,#10b981_100%)] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)]"
              >
                Discuss This Service
              </Link>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(150deg,#1e1b4b_0%,#312e81_45%,#4c1d95_100%)] text-white">
        <div className="public-container">
          <div className="lively-card overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#7c3aed_0%,#6366f1_45%,#0ea5e9_100%)] px-6 py-10 text-white shadow-[0_28px_85px_rgba(124,58,237,0.35)] md:px-10">
            <p className="animate-gradient-pan bg-[linear-gradient(90deg,#ffd1dc,#ffd6a5,#bfe6d5,#bfdbfe,#ddd6fe,#ffd1dc)] bg-[length:220%_100%] bg-clip-text text-xs font-semibold uppercase tracking-[0.3em] text-transparent">How Moonext Works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Site understanding, workforce alignment, execution control, and reporting discipline.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {serviceApproach.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
                  <div key={step.title} className="lively-card rounded-2xl border border-white/20 bg-white/12 px-4 py-4 text-sm text-white backdrop-blur-sm">
                    <div className="flex h-10 w-10 animate-float-slow items-center justify-center rounded-2xl bg-white/20">
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 font-semibold text-white">{step.title}</p>
                    <p className="mt-2 leading-6 text-indigo-100">{step.description}</p>
                  </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#fdf2f8_0%,#f5f3ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Why Clients Choose These Services"
            title="Service support designed to reduce site friction and improve delivery clarity."
            description="Each service line is backed by the same practical Moonext approach: execution discipline, workforce coordination, and stronger operational follow-up."
            tone="violet"
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {assurances.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2}>
                <div key={item.title} className="lively-card rounded-[30px] border border-violet-200/60 bg-white p-6 shadow-[0_16px_45px_rgba(124,58,237,0.10)]">
                  <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f472b6_0%,#8b5cf6_50%,#6366f1_100%)] text-white shadow-[0_10px_25px_rgba(139,92,246,0.24)]">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
