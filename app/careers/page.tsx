import type { Metadata } from "next";
import { BadgeCheck, BriefcaseBusiness, GraduationCap, Users } from "lucide-react";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
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
    <main className="bg-white">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.9fr]">
          <SectionHeading
            eyebrow="Careers"
            title="Join a construction team focused on execution discipline and workforce clarity."
            description="The careers page is ready for real hiring content. Current openings and culture information can be updated later without structural changes."
            invert
          />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Why Join Moonext</p>
            <div className="mt-5 grid gap-3">
              {careersHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section border-b border-slate-200 bg-slate-50">
        <div className="public-container grid gap-6 md:grid-cols-3">
          {careerTraits.map((item) => {
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

      <section className="public-section">
        <div className="public-container">
          <SectionHeading
            eyebrow="Work Environment"
            title="Career pages should also reflect the kind of work our teams handle on site."
            description="These visuals add field context to the hiring page without changing the current careers flow."
            align="center"
          />
          <div className="mt-12">
            <PagePhotoGrid photos={careersPagePhotos} />
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <SectionHeading
            eyebrow="Openings"
            title="Current role placeholders for future hiring updates."
            description="These cards can later be replaced by a CMS feed or admin-managed content without changing the overall layout."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {openRoles.map((role) => (
              <div key={role.title} className="public-panel h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">{role.type}</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{role.title}</h2>
                <p className="mt-2 text-sm font-medium text-moonext-navy">{role.location}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  This role placeholder can be replaced with real responsibilities, qualifications, and application workflow later.
                </p>
                <a
                  href={`mailto:${companyInfo.email}?subject=Career%20Inquiry%20-%20${encodeURIComponent(role.title)}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Apply By Email
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-slate-950 text-white">
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
              <div key={step} className="flex gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moonext-orange text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{step}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    This step can later be expanded with role-specific interview or onboarding details.
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <BadgeCheck size={20} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">Apply through the current placeholder workflow</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Until a formal careers backend is added, applications can be routed through email while the layout and
                page structure remain ready for future upgrades.
              </p>
              <a
                href={`mailto:${companyInfo.email}?subject=General%20Career%20Inquiry`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Send Career Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
