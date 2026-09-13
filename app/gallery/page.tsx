import type { Metadata } from "next";
import Image from "next/image";
import { Camera, HardHat, ImageIcon, ShieldCheck } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicWebsiteContent } from "@/lib/website-content-store";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Moonext Constructions gallery placeholders for site activity, machinery, workforce coordination, and construction progress visuals."
};

const galleryUseCases = [
  {
    title: "Project progress visuals",
    description: "Use approved imagery here to show site milestones, execution pace, and workmanship quality.",
    icon: ImageIcon
  },
  {
    title: "Workforce activity",
    description: "Show labour coordination, supervision, and field movement where appropriate.",
    icon: HardHat
  },
  {
    title: "Safety and quality documentation",
    description: "Use gallery space to reinforce site discipline, inspection culture, and reporting seriousness.",
    icon: ShieldCheck
  }
];

export default async function GalleryPage() {
  const { galleryItems } = await getPublicWebsiteContent();

  return (
    <main className="bg-slate-50">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr,0.8fr]">
          <SectionHeading
            eyebrow="Gallery"
            title="Visual placeholders for site progress, equipment, workforce activity, and execution review."
            description="The gallery structure is production-ready and can later be updated with real project imagery, drone shots, and field documentation."
            invert
          />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Camera size={20} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Built for approved site media</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              The gallery is intentionally modular so real project photos, machine shots, site walkthroughs, and
              workforce documentation can be added later without changing the page design.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-4">
              <p className="text-3xl font-semibold text-white">{galleryItems.length}</p>
              <p className="mt-2 text-sm text-slate-200">Construction-related gallery items currently available on this page.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <div className="mb-8 flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Photo Collection</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Construction-related visuals expanded to 50 items.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              This larger gallery is ready now with related construction visuals and can be replaced progressively with real Moonext project photography.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm ${index === 0 ? "md:col-span-2 xl:col-span-2" : ""}`}
            >
              <div className="relative h-64">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moonext-orange">{item.category}</p>
                <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Construction-related gallery placeholder ready to be swapped with approved Moonext project photography, site visuals, or execution documentation.
                </p>
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="public-section pt-0">
        <div className="public-container">
          <SectionHeading
            eyebrow="Gallery Purpose"
            title="A stronger gallery should support trust, proof of work, and site culture."
            description="The gallery now has a clearer role in the website: showing project activity, workforce discipline, and safety-conscious execution."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {galleryUseCases.map((item) => {
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
