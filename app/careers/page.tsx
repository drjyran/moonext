import type { Metadata } from "next";
import { BadgeCheck, BriefcaseBusiness, GraduationCap, Users } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { careersHighlights, careersPagePhotos, openRoles } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore careers at Moonext Constructions Pvt Ltd across site operations, project coordination, labour systems, and construction support roles."
};

const careerTraits = [
  {
    title: "Field ownership",
    description: "Moonext values people who can take responsibility for execution, coordination, and follow-up.",
    icon: BriefcaseBusiness
  },
  {
    title: "Learning mindset",
    description: "Site operations improve when team members stay practical, curious, and ready to adapt.",
    icon: GraduationCap
  },
  {
    title: "Team discipline",
    description: "Construction outcomes improve when teams communicate clearly and work in sync.",
    icon: Users
  }
];

const hiringSteps = [
  "Initial profile review",
  "Role and site-fit discussion",
  "Practical responsibility alignment",
  "Joining and operational onboarding"
];

export default async function CareersPage() {
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;

  return (
    <main className="bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_35%,#eef9ff_100%)]">
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0b1026_0%,#064e3b_35%,#10b981_68%,#0ea5e9_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.9fr]">
          <SectionHeading
            eyebrow="Careers"
            title="Join a construction team focused on execution discipline and workforce clarity."
            description="The careers page is ready for real hiring content. Current openings and culture information can be updated later without structural changes."
            invert
          />

          <div className="lively-card rounded-[28px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_45px_rgba(16,185,129,0.24)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Why Join Moonext</p>
            <div className="mt-5 grid gap-3">
              {careersHighlights.map((item) => (
                <div key={item} className="lively-card rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section border-b border-emerald-200/50 bg-[linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)]">
        <div className="public-container grid gap-6 md:grid-cols-3">
          {careerTraits.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2}>
              <div key={item.title} className="lively-card rounded-[28px] border border-emerald-200/60 bg-white p-6 shadow-[0_16px_45px_rgba(16,185,129,0.10)]">
                <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#14b8a6_50%,#0ea5e9_100%)] text-white shadow-[0_10px_25px_rgba(16,185,129,0.24)]">
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

      <section className="public-section bg-[linear-gradient(180deg,#e0f2fe_0%,#eef9ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Work Environment"
            title="Career pages should also reflect the kind of work our teams handle on site."
            description="These visuals add field context to the hiring page without changing the current careers flow."
            tone="sky"
            align="center"
          />
          <Reveal delay={1}>
          <div className="mt-12">
            <PagePhotoGrid photos={careersPagePhotos} />
          </div>
          </Reveal>
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(180deg,#fef3c7_0%,#fdf2f8_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="Openings"
            title="Current role placeholders for future hiring updates."
            description="These cards can later be replaced by a CMS feed or admin-managed content without changing the overall layout."
            tone="rose"
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {openRoles.map((role, index) => (
              <Reveal key={role.title} delay={(index % 3) as 0 | 1 | 2}>
              <div key={role.title} className="lively-card rounded-[28px] border border-rose-200/60 bg-white p-6 shadow-[0_16px_45px_rgba(244,63,94,0.10)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] bg-gradient-to-r from-rose-600 to-emerald-500 bg-clip-text text-transparent">{role.type}</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{role.title}</h2>
                <p className="mt-2 text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">{role.location}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  This role placeholder can be replaced with real responsibilities, qualifications, and application workflow later.
                </p>
                <a
                  href={`mailto:${companyInfo.email}?subject=Career%20Inquiry%20-%20${encodeURIComponent(role.title)}`}
                  className="lively-button mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(244,63,94,0.26)]"
                >
                  Apply By Email
                </a>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[linear-gradient(150deg,#0b1026_0%,#1e1b4b_40%,#4c1d95_100%)] text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Hiring Flow"
              title="A simple hiring structure that can scale later."
              description="The careers page is now ready for a more complete recruitment workflow, but it remains lightweight and production-safe for the current site stage."
              invert
            />
          </div>

          <div className="grid gap-4">
            {hiringSteps.map((step, index) => (
              <Reveal key={step} delay={(index % 4) as 0 | 1 | 2 | 3}>
              <div key={step} className="lively-card flex gap-4 rounded-[28px] border border-white/20 bg-white/12 p-5 shadow-[0_16px_40px_rgba(124,58,237,0.20)] backdrop-blur-md">
                <div className="flex h-11 w-11 shrink-0 animate-float-slow items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(244,63,94,0.24)]">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{step}</p>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    This step can later be expanded with role-specific interview or onboarding details.
                  </p>
                </div>
              </div>
              </Reveal>
            ))}

            <Reveal delay={3}>
            <div className="lively-card rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_55%,#0ea5e9_100%)] p-6 shadow-[0_20px_55px_rgba(124,58,237,0.28)]">
              <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-white/20">
                <BadgeCheck size={20} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">Apply through the current placeholder workflow</h2>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                Until a formal careers backend is added, applications can be routed through email while the layout and
                page structure remain ready for future upgrades.
              </p>
              <a
                href={`mailto:${companyInfo.email}?subject=General%20Career%20Inquiry`}
                className="lively-button mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(244,63,94,0.26)]"
              >
                Send Career Inquiry
              </a>
            </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
