import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { PagePhotoGrid } from "@/components/public/page-photo-grid";
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
    <main className="bg-slate-50">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.9fr]">
          <SectionHeading
            eyebrow="Contact Us"
            title="Connect with Moonext for project discussions, site support, and construction inquiries."
            description="Use the inquiry form or reach out directly through the contact details below. Placeholder values are structured to be easily updated later."
            invert
          />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">Direct Contact</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
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

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="public-container grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm font-medium text-moonext-navy">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="public-section">
        <div className="public-container grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <ContactForm services={websiteContent.services} />

          <div className="space-y-6">
            <div className="public-panel bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">What to contact us for</h2>
              <div className="mt-5 grid gap-3">
                {inquiryReasons.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="public-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Business Hours</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                {companyInfo.hours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="public-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Visuals</p>
              <div className="mt-5">
                <PagePhotoGrid photos={contactPagePhotos} />
              </div>
            </div>

            <div className="public-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Quick Actions</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${companyInfo.phone[0].replace(/\s+/g, "")}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Email Us
                </a>
                <Link
                  href="/services"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Explore Services
                </Link>
                <Link
                  href="/staff-access"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Staff Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions from clients and visitors."
            description="These placeholders give the website a clearer trust-building structure and can be expanded later."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {faqItems.map((faq) => (
              <div key={faq.question} className="public-panel h-full">
                <h2 className="text-lg font-semibold text-slate-950">{faq.question}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
