import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ClipboardList, HardHat, Landmark } from "lucide-react";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { ProjectsBrowser } from "@/components/public/projects-browser";
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
    <main className="bg-slate-50">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.8fr]">
          <SectionHeading
            eyebrow="Projects"
            title="A project showcase built around practical execution and site-level accountability."
            description="These example projects highlight how Moonext supports different construction categories while maintaining workforce visibility and delivery discipline."
            invert
          />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Project Coverage</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Project records", value: `${projects.length}+` },
                { label: "Ongoing work", value: `${ongoingCount}` },
                { label: "Completed work", value: `${completedCount}` },
                { label: "Infrastructure references", value: `${infrastructureCount}` }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-4">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section border-b border-slate-200 bg-white">
        <div className="public-container grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Project Lens"
              title="Project pages should show more than images. They should show delivery character."
              description="Moonext’s project presentation is built around category, location, execution status, and the operational support behind the work."
            />
          </div>

          <div className="grid gap-4">
            {deliverySteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="public-panel flex items-start gap-4 p-5 sm:p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Site Images"
            title="Project pages now carry stronger construction visuals across categories."
            description="These images reinforce the project showcase with work fronts, cranes, and landmark execution references."
            align="center"
          />
          <div className="mt-12">
            <PagePhotoGrid photos={projectsPagePhotos} />
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <ProjectsBrowser projects={projects} />
        </div>
      </section>

      <section className="public-section pt-0">
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
          ].map((item) => {
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
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <div className="public-panel flex flex-col gap-5 bg-white md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Discussions</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Need site execution support, labour coordination, or supervised delivery help?
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Start An Inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
