import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { contactPagePhotos, faqItems } from "@/lib/company-content";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Moonext Constructions Pvt Ltd for project inquiries, construction support, labour coordination, and site execution discussions."
};

const inquiryReasons = [
  "Construction project quotation",
  "Civil execution support",
  "Labour deployment and site operations discussion",
  "Renovation or maintenance requirement"
];

export default async function ContactPage() {
  const websiteContent = await getPublicWebsiteContent();
  const companyInfo = websiteContent.companyInfo;
  const contactCards = [
    {
      title: "Phone",
      value: companyInfo.phone.join(" / "),
      note: "Use for immediate project coordination or inquiry follow-up.",
      icon: Phone
    },
    {
      title: "Email",
      value: companyInfo.email,
      note: "Best for quotations, documents, and detailed project discussions.",
      icon: Mail
    },
    {
      title: "Office Address",
      value: companyInfo.officeAddress.join(", "),
      note: "Registered office details can be updated later without changing page structure.",
      icon: MapPin
    },
    {
      title: "Business Hours",
      value: companyInfo.hours[0],
      note: companyInfo.hours[1],
      icon: Clock3
    }
  ];

  return (
    <main className="bg-[linear-gradient(180deg,#fdf2f8_0%,#ffffff_35%,#fdf4ff_100%)]">
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0b1026_0%,#312e81_35%,#7c3aed_68%,#fb7185_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.9fr]">
          <SectionHeading
            eyebrow="Contact Us"
            title="Connect with Moonext for project discussions, site support, and construction inquiries."
            description="Use the inquiry form or reach out directly through the contact details below. Placeholder values are structured to be easily updated later."
            invert
          />

          <div className="lively-card rounded-[28px] border border-white/20 bg-white/12 p-6 shadow-[0_18px_45px_rgba(124,58,237,0.24)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Direct Contact</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-100">
              <p><span className="font-semibold text-white">Phone:</span> {companyInfo.phone.join(" / ")}</p>
              <p><span className="font-semibold text-white">Email:</span> {companyInfo.email}</p>
              <div>
                <p className="font-semibold text-white">Office Address:</p>
                {companyInfo.officeAddress.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-violet-200/50 bg-[linear-gradient(100deg,#fdf2f8_0%,#fef3c7_30%,#d1fae5_65%,#e0f2fe_100%)] py-8">
        <div className="public-container grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
              <div key={card.title} className="lively-card rounded-[28px] border border-violet-200/60 bg-white p-5 shadow-[0_12px_32px_rgba(124,58,237,0.10)]">
                <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] text-white shadow-[0_10px_24px_rgba(244,63,94,0.22)]">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.note}</p>
              </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <ContactForm services={websiteContent.services} />

          <div className="space-y-6">
            <Reveal delay={1}>
            <div className="lively-card rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_55%,#db2777_100%)] p-6 text-white shadow-[0_20px_55px_rgba(124,58,237,0.28)]">
              <div className="flex h-12 w-12 animate-float-slow items-center justify-center rounded-2xl bg-white/20">
                <ShieldCheck size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">What to contact us for</h2>
              <div className="mt-5 grid gap-3">
                {inquiryReasons.map((item) => (
                  <div key={item} className="lively-card rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            </Reveal>

            <div className="public-panel lively-card">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] bg-gradient-to-r from-rose-600 to-emerald-500 bg-clip-text text-transparent">Business Hours</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                {companyInfo.hours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="public-panel lively-card">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] bg-gradient-to-r from-sky-600 to-violet-500 bg-clip-text text-transparent">Project Visuals</p>
              <div className="mt-5">
                <PagePhotoGrid photos={contactPagePhotos} />
              </div>
            </div>

            <div className="public-panel lively-card">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">Quick Actions</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${companyInfo.phone[0].replace(/\s+/g, "")}`}
                  className="lively-button inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(244,63,94,0.26)]"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="lively-button inline-flex min-h-11 items-center justify-center rounded-full border border-sky-300 bg-white/90 px-5 text-sm font-semibold text-sky-800 shadow-[0_10px_25px_rgba(14,165,233,0.12)]"
                >
                  Email Us
                </a>
                <Link
                  href="/services"
                  className="lively-button inline-flex min-h-11 items-center justify-center rounded-full border border-violet-300 bg-white/90 px-5 text-sm font-semibold text-violet-800 shadow-[0_10px_25px_rgba(124,58,237,0.12)]"
                >
                  Explore Services
                </Link>
                <Link
                  href="/staff-access"
                  className="lively-button inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300 bg-white/90 px-5 text-sm font-semibold text-emerald-800 shadow-[0_10px_25px_rgba(16,185,129,0.12)]"
                >
                  Staff Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section pt-0 bg-[linear-gradient(180deg,#fdf4ff_0%,#f5f3ff_100%)]">
        <div className="public-container">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions from clients and visitors."
            description="These placeholders give the website a clearer trust-building structure and can be expanded later."
            tone="violet"
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {faqItems.map((faq, index) => (
              <Reveal key={faq.question} delay={(index % 3) as 0 | 1 | 2}>
              <div key={faq.question} className="lively-card rounded-[28px] border border-violet-200/60 bg-white p-6 shadow-[0_14px_40px_rgba(124,58,237,0.10)]">
                <h2 className="text-lg font-semibold text-slate-950">{faq.question}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
