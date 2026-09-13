import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CircleDot, ShieldCheck, Target, Telescope, Workflow } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { Reveal } from "@/components/public/reveal";
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
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0b1026_0%,#1e1b4b_35%,#7c3aed_70%,#0ea5e9_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <SectionHeading
            eyebrow="About Moonext"
            title="A construction company shaped by project discipline, workforce systems, and site realities."
            description={companyInfo.description}
            invert
          />

          <div className="grid gap-4">
            {missionVision.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={(index % 2) as 0 | 1}>
                  <div key={item.title} className="lively-card rounded-[28px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_45px_rgba(124,58,237,0.20)] backdrop-blur-md">
                    <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                      <Icon size={22} />
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-indigo-100">{item.description}</p>
                  </div>
                </Reveal>
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
              tone="rose"
            />

            <div className="mt-8 grid gap-4">
              {workingModel.map((item, index) => (
                <Reveal key={item.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
                  <div className="lively-card flex gap-4 rounded-[28px] border border-rose-200/60 bg-white p-5 shadow-[0_12px_30px_rgba(244,63,94,0.08)]">
                    <div className="flex h-11 w-11 shrink-0 animate-float-slow items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(244,63,94,0.24)]">
                      0{index + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#fdf2f8_0%,#f5f3ff_50%,#eef9ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Project Presence"
            title="Moonext’s public profile now carries real site and project visuals."
            description="These photos support the company story with project-facing context while keeping the existing page structure intact."
            tone="sky"
            align="center"
          />
          <Reveal delay={1}>
          <div className="mt-12">
            <PagePhotoGrid photos={aboutPagePhotos} />
          </div>
          </Reveal>
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(180deg,#f5f3ff_0%,#e0f2fe_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Company Strengths"
            title="Execution capability built around control, accountability, and field practicality."
            description="Moonext combines public-facing construction credibility with internal systems that support labour visibility, attendance discipline, and payment clarity."
            tone="violet"
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseMoonext.map((item, index) => (
              <Reveal key={item.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <div className="lively-card rounded-[30px] border border-violet-200/50 bg-white p-6 shadow-[0_16px_45px_rgba(124,58,237,0.10)]">
                  <div className="flex h-11 w-11 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e879f9_0%,#8b5cf6_50%,#6366f1_100%)] text-white shadow-[0_10px_24px_rgba(139,92,246,0.24)]">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#ecfdf5_0%,#eff6ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Core Values"
            title="What guides the way Moonext works on projects and with people."
            description="Our values are built to support long-term trust, stronger site outcomes, and a more disciplined approach to construction execution."
            tone="emerald"
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <div className="lively-card rounded-[30px] border border-emerald-200/50 bg-white p-6 shadow-[0_16px_45px_rgba(16,185,129,0.10)]">
                  <div className="flex h-11 w-11 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#14b8a6_50%,#0ea5e9_100%)] text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{value.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(180deg,#eff6ff_0%,#fdf2f8_55%,#fffbeb_100%)]">
        <div className="public-container grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">
          <Reveal delay={1}>
          <div className="lively-card rounded-[30px] border border-sky-200/60 bg-[linear-gradient(150deg,#ecfeff_0%,#e0f2fe_45%,#ede9fe_100%)] p-8 shadow-[0_24px_70px_rgba(14,165,233,0.14)]">
            <div className="flex h-14 w-14 animate-float-fast items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0ea5e9_0%,#6366f1_50%,#8b5cf6_100%)] text-white shadow-[0_10px_25px_rgba(14,165,233,0.30)]">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-slate-950">Quality and safety remain part of our operating discipline.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              From supervision to reporting, Moonext is aligned around practical quality expectations, safer site
              processes, and reliable execution habits that support better project outcomes.
            </p>
            <div className="mt-6 rounded-2xl border border-sky-200/60 bg-white px-4 py-4 text-sm leading-7 text-slate-600">
              The company website and internal labour portal are intentionally aligned so clients see delivery
              capability while internal teams maintain disciplined operational control.
            </div>
          </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Leadership"
              title="FY 2024–25 ke anusar directors: Vijay Kumar aur Vinay Kumar."
              description="Dono directors ki 50%-50% shareholding hai. Founder / CEO / MD jaise titles assume nahi kiye gaye hain."
              tone="rose"
            />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {leadershipTeam.map((leader, index) => (
                <Reveal key={leader.name} delay={(index % 2) as 0 | 1}>
                  <article key={leader.name} className="lively-card overflow-hidden rounded-[28px] border border-rose-200/60 bg-white shadow-[0_14px_40px_rgba(244,63,94,0.10)]">
                    <div className="relative aspect-[4/5] bg-slate-100">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover object-center transition duration-700 hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] bg-gradient-to-r from-rose-600 to-emerald-500 bg-clip-text text-transparent">{leader.role}</p>
                      <h3 className="mt-4 text-2xl font-semibold text-slate-950">{leader.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{leader.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={2}>
            <div className="mt-6 rounded-[28px] border border-violet-200/60 bg-[linear-gradient(150deg,#f8f9ff_0%,#f5f3ff_100%)] p-6 shadow-[0_14px_40px_rgba(124,58,237,0.10)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">Statutory Audit</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Statutory Auditor: Murmuria & Associates, Chartered Accountants, Kolkata. Auditor report me koi
                qualification, reservation ya adverse remark nahi bataya gaya.
              </p>
              <Link href="/company-profile" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
                Full audited summary ke liye Company Profile dekhein
                <ArrowRight size={16} />
              </Link>
            </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
