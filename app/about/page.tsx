import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Building2, ShieldCheck, Target, Telescope, Workflow } from "lucide-react";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { aboutPagePhotos, values, whyChooseMoonext } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Moonext Constructions Pvt Ltd, its mission, vision, values, and commitment to safety, quality, and disciplined project execution."
};

const missionVision = [
  {
    title: "Mission",
    description:
      "To deliver dependable construction and workforce coordination support through disciplined execution, clear site visibility, and practical operating systems.",
    icon: Target
  },
  {
    title: "Vision",
    description:
      "To become a trusted construction and execution partner known for reliable delivery, operational clarity, and strong labour management practices.",
    icon: Telescope
  }
];

const workingModel = [
  {
    title: "Understand the work front",
    description: "We start with the actual project condition, crew requirement, and site execution constraints."
  },
  {
    title: "Plan labour and supervision",
    description: "Deployment, reporting responsibility, and coordination rhythm are defined before work scales."
  },
  {
    title: "Control execution on site",
    description: "Daily visibility, supervision support, and operational discipline help teams stay accountable."
  },
  {
    title: "Close the loop with clarity",
    description: "Attendance, settlement, and reporting are treated as part of delivery quality rather than an afterthought."
  }
];

export default async function AboutPage() {
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;
  const leadershipTeam = websiteContent.leadershipTeam;
  const companySnapshot = [
    { label: "Legal Name", value: "MOONEXT CONSTRUCTIONS PRIVATE LIMITED", icon: Building2 },
    { label: "CIN", value: companyInfo.cin, icon: Workflow },
    { label: "Registered Office", value: "Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106", icon: ShieldCheck }
  ];

  return (
    <main className="bg-white">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <SectionHeading
            eyebrow="About Moonext"
            title="A construction company shaped by project discipline, workforce systems, and site realities."
            description={companyInfo.description}
            invert
          />

          <div className="grid gap-4">
            {missionVision.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="public-section border-b border-slate-200 bg-slate-50">
        <div className="public-container grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="public-panel bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Company Snapshot</p>
            <div className="mt-6 grid gap-4">
              {companySnapshot.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-white">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="How Moonext Works"
              title="A practical operating model built for execution, not presentation alone."
              description="Moonext is structured around the way construction work actually moves on site: planning, labour alignment, supervision, reporting, and settlement clarity."
            />

            <div className="mt-8 grid gap-4">
              {workingModel.map((item, index) => (
                <div key={item.title} className="flex gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moonext-navy text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Project Presence"
            title="Moonext’s public profile now carries real site and project visuals."
            description="These photos support the company story with project-facing context while keeping the existing page structure intact."
            align="center"
          />
          <div className="mt-12">
            <PagePhotoGrid photos={aboutPagePhotos} />
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <SectionHeading
            eyebrow="Company Strengths"
            title="Execution capability built around control, accountability, and field practicality."
            description="Moonext combines public-facing construction credibility with internal systems that support labour visibility, attendance discipline, and payment clarity."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseMoonext.map((item) => (
              <div key={item.title} className="public-panel h-full">
                <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-50">
        <div className="public-container">
          <SectionHeading
            eyebrow="Core Values"
            title="What guides the way Moonext works on projects and with people."
            description="Our values are built to support long-term trust, stronger site outcomes, and a more disciplined approach to construction execution."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="public-panel h-full">
                <h2 className="text-xl font-semibold text-slate-950">{value.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">
          <div className="public-panel bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-moonext-navy text-white">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-slate-950">Quality and safety remain part of our operating discipline.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              From supervision to reporting, Moonext is aligned around practical quality expectations, safer site
              processes, and reliable execution habits that support better project outcomes.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-600">
              The company website and internal labour portal are intentionally aligned so clients see delivery
              capability while internal teams maintain disciplined operational control.
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Leadership"
              title="FY 2024–25 ke anusar directors: Vijay Kumar aur Vinay Kumar."
              description="Dono directors ki 50%-50% shareholding hai. Founder / CEO / MD jaise titles assume nahi kiye gaye hain."
            />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {leadershipTeam.map((leader) => (
                <article key={leader.name} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/5] bg-slate-100">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">{leader.role}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{leader.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{leader.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Statutory Audit</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Statutory Auditor: Murmuria & Associates, Chartered Accountants, Kolkata. Auditor report me koi
                qualification, reservation ya adverse remark nahi bataya gaya.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-moonext-navy">
                Full audited summary ke liye Company Profile dekhein
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
