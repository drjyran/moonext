import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, HardHat, MapPinned, ShieldCheck, TimerReset } from "lucide-react";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
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
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.8fr]">
          <SectionHeading
            eyebrow="Services"
            title="Construction and workforce support tailored to real execution environments."
            description="Moonext delivers services that combine project supervision, labour coordination, civil execution support, and construction-site discipline."
            invert
          />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Service Coverage</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {serviceSectors.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm font-medium text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Service Visuals"
            title="Execution services backed by on-site electrical, workforce, and tool-level realities."
            description="The services section now includes project-relevant images so visitors can connect service lines to actual site conditions."
            align="center"
          />
          <div className="mt-12">
            <PagePhotoGrid photos={servicesPagePhotos} />
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="public-panel h-full">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-sm font-black tracking-[0.16em] text-white">
                {service.icon}
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-950">{service.title}</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-moonext-orange">Execution-focused service line</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>

              <div className="mt-6 grid gap-3">
                {service.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {bullet}
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Discuss This Service
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container">
          <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-6 py-10 text-white shadow-xl md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">How Moonext Works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Site understanding, workforce alignment, execution control, and reporting discipline.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {serviceApproach.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 font-semibold text-white">{step.title}</p>
                    <p className="mt-2 leading-6 text-slate-300">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Why Clients Choose These Services"
            title="Service support designed to reduce site friction and improve delivery clarity."
            description="Each service line is backed by the same practical Moonext approach: execution discipline, workforce coordination, and stronger operational follow-up."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="public-panel h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
