import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  const { projects } = await getPublicWebsiteContent();
  return projects.find((project) => project.slug === slug);
}

export async function generateStaticParams() {
  const { projects } = await getPublicWebsiteContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found"
    };
  }

  return {
    title: project.seoTitle ?? `${project.title} | Moonext Constructions Pvt Ltd`,
    description: project.seoDescription ?? `${project.title} in ${project.location}. ${project.description}`,
    openGraph: {
      title: project.seoTitle ?? `${project.title} | Moonext Constructions Pvt Ltd`,
      description: project.seoDescription ?? `${project.title} in ${project.location}. ${project.description}`,
      images: [project.image]
    }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const websiteContent = await getPublicWebsiteContent();
  const project = websiteContent.projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const projectOverview = project.summary || project.description;
  const scopeOfWork = project.scopeOfWork && project.scopeOfWork.length > 0
    ? project.scopeOfWork
    : [
        "Execution support aligned with site conditions and project category requirements.",
        "Workforce coordination and labour discipline across active work fronts.",
        "Quality-conscious follow-through built around dependable delivery support."
      ];
  const keyHighlights = project.keyHighlights && project.keyHighlights.length > 0 ? project.keyHighlights : project.metrics;
  const safetyCommitment =
    project.safetyCommitment ||
    "Moonext Constructions Pvt Ltd approaches project execution with attention to safe work practices, disciplined site conduct, dependable workforce coordination, and quality-focused follow-through.";
  const isInstitutionalOrHealthcare =
    [project.category, project.clientCategory, project.industry]
      .filter(Boolean)
      .some((value) => {
        const normalized = value?.toLowerCase() ?? "";
        return normalized.includes("health") || normalized.includes("institution");
      });
  const ctaTitle = isInstitutionalOrHealthcare
    ? "Looking for reliable construction execution and workforce support for institutional or healthcare projects?"
    : `Discuss a similar project requirement with ${websiteContent.companyInfo.shortName}.`;

  return (
    <main className="bg-white">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200">{project.category} Project</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-slate-200">{project.location}</p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200">{projectOverview}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              <span>{project.status}</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{project.year}</span>
              {project.industry ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  <span>{project.industry}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">
          <div className="public-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Snapshot</p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p><span className="font-semibold text-slate-950">Client / Project:</span> {project.clientName || project.title}</p>
              <p><span className="font-semibold text-slate-950">Location:</span> {project.location}</p>
              <p><span className="font-semibold text-slate-950">Category:</span> {project.category}</p>
              {project.clientCategory ? <p><span className="font-semibold text-slate-950">Client Category:</span> {project.clientCategory}</p> : null}
              {project.industry ? <p><span className="font-semibold text-slate-950">Industry:</span> {project.industry}</p> : null}
              <p><span className="font-semibold text-slate-950">Status:</span> {project.status}</p>
              <p><span className="font-semibold text-slate-950">Executed By:</span> {websiteContent.companyInfo.name}</p>
              <p><span className="font-semibold text-slate-950">Reference Period:</span> {project.year}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Overview</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Delivery support shaped around site execution and workforce coordination.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{projectOverview}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container grid gap-8 lg:grid-cols-2">
          <div className="public-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Scope of Work</p>
            <div className="mt-6 space-y-3">
              {scopeOfWork.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="public-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Key Highlights</p>
            <div className="mt-6 space-y-3">
              {keyHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <div className="public-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Safety & Quality Commitment</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Execution support shaped by disciplined site conduct and dependable standards.
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">{safetyCommitment}</p>
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container">
          <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-6 py-10 text-white shadow-xl md:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Project Inquiry</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  {ctaTitle}
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Back To Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
