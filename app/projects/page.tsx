import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ClipboardList, HardHat, Landmark } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { ProjectsBrowser } from "@/components/public/projects-browser";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { projectsPagePhotos } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "View Moonext Constructions project showcase across residential, commercial, and infrastructure work with delivery status and location details."
};

const deliverySteps = [
  {
    title: "Category-fit planning",
    description: "Each project is approached according to site type, work package complexity, and labour intensity.",
    icon: Building2
  },
  {
    title: "Execution visibility",
    description: "Moonext keeps reporting and operational control close to field activity and site progress.",
    icon: ClipboardList
  },
  {
    title: "Workforce coordination",
    description: "Crew movement, labour support, and contractor alignment remain part of project continuity.",
    icon: HardHat
  }
];

export default async function ProjectsPage() {
  const { projects } = await getPublicWebsiteContent();
  const ongoingCount = projects.filter((project) => project.status === "Ongoing").length;
  const completedCount = projects.filter((project) => project.status === "Completed").length;
  const infrastructureCount = projects.filter((project) => project.category === "Infrastructure").length;

  return (
    <main className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_30%,#f5f3ff_100%)]">
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0b1026_0%,#1e1b4b_35%,#1d4ed8_68%,#0ea5e9_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.8fr]">
          <SectionHeading
            eyebrow="Projects"
            title="A project showcase built around practical execution and site-level accountability."
            description="These example projects highlight how Moonext supports different construction categories while maintaining workforce visibility and delivery discipline."
            invert
          />

          <div className="lively-card rounded-[28px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_45px_rgba(29,78,216,0.22)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Project Coverage</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Project records", value: `${projects.length}+` },
                { label: "Ongoing work", value: `${ongoingCount}` },
                { label: "Completed work", value: `${completedCount}` },
                { label: "Infrastructure references", value: `${infrastructureCount}` }
              ].map((item, index) => (
                <Reveal key={item.label} delay={(index % 2) as 0 | 1}>
                <div key={item.label} className="lively-card rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <p className="animate-[float-slow_5s_ease-in-out_infinite] text-2xl font-semibold bg-gradient-to-r from-rose-300 via-amber-300 to-sky-300 bg-clip-text text-transparent">{item.value}</p>
                  <p className="mt-2 text-sm text-sky-100">{item.label}</p>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section border-b border-violet-200/50 bg-[linear-gradient(180deg,#ffffff_0%,#f5f3ff_100%)]">
        <div className="public-container grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Project Lens"
              title="Project pages should show more than images. They should show delivery character."
              description="Moonext’s project presentation is built around category, location, execution status, and the operational support behind the work."
              tone="violet"
            />
          </div>

          <div className="grid gap-4">
            {deliverySteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2}>
                <div key={item.title} className="public-panel lively-card flex items-start gap-4 p-5 sm:p-6">
                  <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-white shadow-[0_10px_25px_rgba(244,63,94,0.24)]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#f5f3ff_0%,#e0f2fe_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Site Images"
            title="Project pages now carry stronger construction visuals across categories."
            description="These images reinforce the project showcase with work fronts, cranes, and landmark execution references."
            tone="sky"
            align="center"
          />
          <Reveal delay={1}>
          <div className="mt-12">
            <PagePhotoGrid photos={projectsPagePhotos} />
          </div>
          </Reveal>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <ProjectsBrowser projects={projects} />
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(180deg,#e0f2fe_0%,#fdf2f8_100%)]">
        <div className="public-container grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Residential",
              description: "Supports housing and mixed-use sites where milestone tracking and labour visibility matter daily.",
              icon: Building2
            },
            {
              title: "Commercial",
              description: "Helps fit-out and time-sensitive work packages stay coordinated across multiple trades and crews.",
              icon: Landmark
            },
            {
              title: "Infrastructure",
              description: "Improves control for field-heavy packages that require movement planning and stronger reporting.",
              icon: ClipboardList
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2}>
              <div key={item.title} className="lively-card rounded-[30px] border border-rose-200/60 bg-white p-6 shadow-[0_16px_45px_rgba(244,63,94,0.10)]">
                <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-white shadow-[0_10px_25px_rgba(244,63,94,0.24)]">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <Reveal delay={1}>
          <div className="lively-card flex flex-col gap-5 rounded-[32px] border border-violet-200/60 bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_55%,#0ea5e9_100%)] p-8 text-white shadow-[0_28px_85px_rgba(124,58,237,0.28)] md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Project Discussions</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Need site execution support, labour coordination, or supervised delivery help?
              </h2>
            </div>
            <Link
              href="/contact"
              className="lively-button inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(244,63,94,0.3)]"
            >
              Start An Inquiry
            </Link>
          </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
