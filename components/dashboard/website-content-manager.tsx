"use client";

import type { ReactNode, TextareaHTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  FileImage,
  GalleryHorizontal,
  LayoutTemplate,
  Plus,
  Save,
  Trash2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import type {
  GalleryItemContent,
  HomeHeroSlideContent,
  LeadershipMemberContent,
  ProjectContent,
  PublicWebsiteContent,
  ServiceContent,
  WebsiteSectionKey
} from "@/lib/website-content";

type ListSectionKey = "leadershipTeam" | "services" | "projects" | "galleryItems";

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nextSortOrder(items: { sortOrder: number }[]) {
  return Math.max(0, ...items.map((item) => item.sortOrder)) + 1;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSortOrder(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function createHeroSlide(items: HomeHeroSlideContent[]): HomeHeroSlideContent {
  return {
    eyebrow: "New Slide",
    title: "Construction delivery with clear site control",
    description: "Add slide copy, image path, and sequencing for the homepage hero carousel.",
    image: "/site/project-yashobhoomi.jpg",
    sortOrder: nextSortOrder(items)
  };
}

function createLeadershipItem(items: LeadershipMemberContent[]): LeadershipMemberContent {
  return {
    name: "Director Name",
    role: "Director",
    description: "Add a short leadership profile for the public website.",
    image: "/site/director-jeetendra-singh.jpg",
    sortOrder: nextSortOrder(items)
  };
}

function createServiceItem(items: ServiceContent[]): ServiceContent {
  return {
    slug: `service-${nextSortOrder(items)}`,
    title: "New Service",
    shortDescription: "Short summary for cards and homepage sections.",
    description: "Detailed service description for the services page.",
    icon: "NS",
    bullets: ["Key delivery point"],
    sortOrder: nextSortOrder(items)
  };
}

function createProjectItem(items: ProjectContent[]): ProjectContent {
  return {
    slug: `project-${nextSortOrder(items)}`,
    title: "New Project",
    clientName: "Client / Project Name",
    location: "Project Location",
    category: "Commercial",
    clientCategory: "Project Category",
    industry: "Construction",
    status: "Ongoing",
    description: "Short project description for project cards.",
    summary: "Longer project summary for the project detail page.",
    image: "/site/project-yashobhoomi.jpg",
    year: "2026",
    metrics: ["Add project metric"],
    scopeOfWork: ["Add scope point"],
    keyHighlights: ["Add project highlight"],
    safetyCommitment: "Add a brief safety and quality note for this project.",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    sortOrder: nextSortOrder(items)
  };
}

function createGalleryItem(items: GalleryItemContent[]): GalleryItemContent {
  return {
    title: "New Gallery Image",
    image: "/site/project-yashobhoomi.jpg",
    category: "Site Activity",
    sortOrder: nextSortOrder(items)
  };
}

export function WebsiteContentManager() {
  const { pushToast } = useToast();
  const [content, setContent] = useState<PublicWebsiteContent | null>(null);
  const [baseline, setBaseline] = useState<PublicWebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<WebsiteSectionKey | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWebsiteContent() {
      const res = await fetch("/api/website/content");
      if (!res.ok) {
        if (!cancelled) {
          pushToast(await getError(res), "error");
          setLoading(false);
        }
        return;
      }

      const data = (await res.json()) as PublicWebsiteContent;
      if (cancelled) return;

      const nextContent = cloneValue(data);
      setContent(nextContent);
      setBaseline(cloneValue(nextContent));
      setLoading(false);
    }

    void loadWebsiteContent();

    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  const summary = useMemo(() => {
    if (!content) {
      return {
        services: "0",
        projects: "0",
        gallery: "0",
        leaders: "0"
      };
    }

    return {
      services: String(content.services.length),
      projects: String(content.projects.length),
      gallery: String(content.galleryItems.length),
      leaders: String(content.leadershipTeam.length)
    };
  }, [content]);

  function isDirty(section: WebsiteSectionKey) {
    if (!content || !baseline) return false;
    return JSON.stringify(content[section]) !== JSON.stringify(baseline[section]);
  }

  function updateContent(updater: (current: PublicWebsiteContent) => PublicWebsiteContent) {
    setContent((current) => (current ? updater(current) : current));
  }

  function updateHomeHeroSlide(index: number, updater: (item: HomeHeroSlideContent) => HomeHeroSlideContent) {
    updateContent((current) => {
      const slides = current.homeHero.slides.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
      return {
        ...current,
        homeHero: {
          ...current.homeHero,
          slides
        }
      };
    });
  }

  function addHomeHeroSlide() {
    updateContent((current) => ({
      ...current,
      homeHero: {
        ...current.homeHero,
        slides: [...current.homeHero.slides, createHeroSlide(current.homeHero.slides)]
      }
    }));
  }

  function removeHomeHeroSlide(index: number) {
    if (!content || content.homeHero.slides.length <= 1) {
      pushToast("At least one hero slide is required", "error");
      return;
    }

    updateContent((current) => ({
      ...current,
      homeHero: {
        ...current.homeHero,
        slides: current.homeHero.slides.filter((_, itemIndex) => itemIndex !== index)
      }
    }));
  }

  function updateListItem<K extends ListSectionKey>(
    section: K,
    index: number,
    updater: (item: PublicWebsiteContent[K][number]) => PublicWebsiteContent[K][number]
  ) {
    updateContent((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
    }));
  }

  function addListItem<K extends ListSectionKey>(section: K, item: PublicWebsiteContent[K][number]) {
    updateContent((current) => ({
      ...current,
      [section]: [...current[section], item]
    }));
  }

  function removeListItem(section: ListSectionKey, index: number) {
    if (!content || content[section].length <= 1) {
      pushToast("At least one entry is required in this section", "error");
      return;
    }

    updateContent((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function saveSection(section: WebsiteSectionKey) {
    if (!content) return;

    setSavingSection(section);
    const res = await fetch("/api/website/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        value: content[section]
      })
    });
    setSavingSection(null);

    if (!res.ok) {
      pushToast(await getError(res), "error");
      return;
    }

    const data = (await res.json()) as { value: PublicWebsiteContent[WebsiteSectionKey] };
    const savedValue = cloneValue(data.value);

    setContent((current) => (current ? { ...current, [section]: savedValue } : current));
    setBaseline((current) => (current ? { ...current, [section]: savedValue } : current));
    pushToast("Website section updated");
  }

  function resetSection(section: WebsiteSectionKey) {
    if (!baseline) return;
    const fallbackValue = cloneValue(baseline[section]);
    setContent((current) => (current ? { ...current, [section]: fallbackValue } : current));
  }

  if (loading || !content) {
    return (
      <div className="space-y-4">
        <section className="overflow-hidden rounded-[28px] bg-moonext-navy text-white shadow-xl">
          <div className="grid gap-5 p-6 md:p-8 xl:grid-cols-[1.25fr,0.75fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Website</p>
              <h1 className="text-2xl font-bold sm:text-3xl">Website Content Management</h1>
              <p className="max-w-2xl text-sm leading-6 text-blue-100/90">
                Loading company website content so it can be managed from the dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-moonext-navy text-white shadow-xl">
        <div className="grid gap-5 p-6 md:p-8 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Website</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Website Content Management</h1>
            <p className="max-w-2xl text-sm leading-6 text-blue-100/90">
              Update the public Moonext website from the existing dashboard without rebuilding the labour management
              system or changing live page structure.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <SummaryPill label="Services" value={summary.services} />
            <SummaryPill label="Projects" value={summary.projects} />
            <SummaryPill label="Gallery Items" value={summary.gallery} />
            <SummaryPill label="Leadership" value={summary.leaders} />
          </div>
        </div>
      </section>

      <SectionCard
        eyebrow="Company Details"
        title="Manage the company identity used across the public website."
        description="These fields feed the header, footer, contact areas, and company profile sections."
        icon={Building2}
        actions={(
          <SectionActions
            saving={savingSection === "companyInfo"}
            dirty={isDirty("companyInfo")}
            onReset={() => resetSection("companyInfo")}
            onSave={() => saveSection("companyInfo")}
          />
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <FormField label="Company Name" required>
            <Input
              value={content.companyInfo.name}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, name: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Legal Name" hint="MOONEXT CONSTRUCTIONS PRIVATE LIMITED">
            <Input
              value={content.companyInfo.legalName ?? ""}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, legalName: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Short Name" required>
            <Input
              value={content.companyInfo.shortName}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, shortName: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="CIN" required>
            <Input
              value={content.companyInfo.cin}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, cin: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Primary Phone" required>
            <Input
              value={content.companyInfo.phone[0]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    phone: [event.target.value, current.companyInfo.phone[1]]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Secondary Phone" required>
            <Input
              value={content.companyInfo.phone[1]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    phone: [current.companyInfo.phone[0], event.target.value]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="WhatsApp Number" required hint="Digits only, used by the floating WhatsApp button">
            <Input
              value={content.companyInfo.whatsappNumber}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, whatsappNumber: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Email" required>
            <Input
              value={content.companyInfo.email}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, email: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Office Address Line 1" required>
            <Input
              value={content.companyInfo.officeAddress[0]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    officeAddress: [event.target.value, current.companyInfo.officeAddress[1], current.companyInfo.officeAddress[2]]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Office Address Line 2" required>
            <Input
              value={content.companyInfo.officeAddress[1]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    officeAddress: [current.companyInfo.officeAddress[0], event.target.value, current.companyInfo.officeAddress[2]]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Office Address Line 3" required>
            <Input
              value={content.companyInfo.officeAddress[2]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    officeAddress: [current.companyInfo.officeAddress[0], current.companyInfo.officeAddress[1], event.target.value]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Business Hours Line 1" required>
            <Input
              value={content.companyInfo.hours[0]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    hours: [event.target.value, current.companyInfo.hours[1]]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Business Hours Line 2" required>
            <Input
              value={content.companyInfo.hours[1]}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: {
                    ...current.companyInfo,
                    hours: [current.companyInfo.hours[0], event.target.value]
                  }
                }))
              }
            />
          </FormField>
          <FormField label="Registered Office">
            <Input
              value={content.companyInfo.registeredOffice ?? ""}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, registeredOffice: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Statutory Auditor">
            <Input
              value={content.companyInfo.statutoryAuditor ?? ""}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, statutoryAuditor: event.target.value }
                }))
              }
            />
          </FormField>
        </div>

        <div className="mt-4 grid gap-4">
          <FormField label="Tagline" required>
            <TextArea
              rows={2}
              value={content.companyInfo.tagline}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, tagline: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Company Description" required>
            <TextArea
              rows={4}
              value={content.companyInfo.description}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  companyInfo: { ...current.companyInfo, description: event.target.value }
                }))
              }
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Homepage Hero"
        title="Control the homepage headline, subtext, and image slider."
        description="Hero copy and slides are managed together so the homepage stays visually consistent."
        icon={LayoutTemplate}
        actions={(
          <SectionActions
            saving={savingSection === "homeHero"}
            dirty={isDirty("homeHero")}
            onReset={() => resetSection("homeHero")}
            onSave={() => saveSection("homeHero")}
          />
        )}
      >
        <div className="grid gap-4">
          <FormField label="Headline" required>
            <TextArea
              rows={3}
              value={content.homeHero.headline}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  homeHero: { ...current.homeHero, headline: event.target.value }
                }))
              }
            />
          </FormField>
          <FormField label="Description" required>
            <TextArea
              rows={4}
              value={content.homeHero.description}
              onChange={(event) =>
                updateContent((current) => ({
                  ...current,
                  homeHero: { ...current.homeHero, description: event.target.value }
                }))
              }
            />
          </FormField>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Hero Slides</h3>
            <p className="text-sm text-slate-600">Add or edit the images and text used in the homepage slider.</p>
          </div>
          <Button type="button" variant="secondary" onClick={addHomeHeroSlide} className="gap-2">
            <Plus size={16} />
            Add Slide
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {content.homeHero.slides.map((slide, index) => (
            <div key={`${slide.image}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moonext-orange">Slide {index + 1}</p>
                  <p className="text-sm text-slate-600">Homepage carousel entry</p>
                </div>
                <Button type="button" variant="danger" onClick={() => removeHomeHeroSlide(index)} className="gap-2">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Eyebrow" required>
                  <Input value={slide.eyebrow} onChange={(event) => updateHomeHeroSlide(index, (item) => ({ ...item, eyebrow: event.target.value }))} />
                </FormField>
                <FormField label="Title" required>
                  <Input value={slide.title} onChange={(event) => updateHomeHeroSlide(index, (item) => ({ ...item, title: event.target.value }))} />
                </FormField>
                <FormField label="Image Path" required>
                  <Input value={slide.image} onChange={(event) => updateHomeHeroSlide(index, (item) => ({ ...item, image: event.target.value }))} />
                </FormField>
                <FormField label="Sort Order" required>
                  <Input
                    type="number"
                    min={1}
                    value={slide.sortOrder}
                    onChange={(event) =>
                      updateHomeHeroSlide(index, (item) => ({
                        ...item,
                        sortOrder: parseSortOrder(event.target.value)
                      }))
                    }
                  />
                </FormField>
              </div>

              <div className="mt-4">
                <FormField label="Description" required>
                  <TextArea
                    rows={3}
                    value={slide.description}
                    onChange={(event) => updateHomeHeroSlide(index, (item) => ({ ...item, description: event.target.value }))}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Leadership"
        title="Maintain the director and leadership cards shown on the About page."
        description="Edit public names, roles, summaries, and photo paths without changing the layout."
        icon={Users}
        actions={(
          <SectionActions
            saving={savingSection === "leadershipTeam"}
            dirty={isDirty("leadershipTeam")}
            onReset={() => resetSection("leadershipTeam")}
            onSave={() => saveSection("leadershipTeam")}
          />
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Leadership cards are shown in sort-order sequence.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => addListItem("leadershipTeam", createLeadershipItem(content.leadershipTeam))}
            className="gap-2"
          >
            <Plus size={16} />
            Add Leader
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {content.leadershipTeam.map((leader, index) => (
            <div key={`${leader.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moonext-orange">Leader {index + 1}</p>
                  <p className="text-sm text-slate-600">About-page leadership card</p>
                </div>
                <Button type="button" variant="danger" onClick={() => removeListItem("leadershipTeam", index)} className="gap-2">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Name" required>
                  <Input value={leader.name} onChange={(event) => updateListItem("leadershipTeam", index, (item) => ({ ...item, name: event.target.value }))} />
                </FormField>
                <FormField label="Role" required>
                  <Input value={leader.role} onChange={(event) => updateListItem("leadershipTeam", index, (item) => ({ ...item, role: event.target.value }))} />
                </FormField>
                <FormField label="Image Path" required>
                  <Input value={leader.image} onChange={(event) => updateListItem("leadershipTeam", index, (item) => ({ ...item, image: event.target.value }))} />
                </FormField>
                <FormField label="Sort Order" required>
                  <Input
                    type="number"
                    min={1}
                    value={leader.sortOrder}
                    onChange={(event) =>
                      updateListItem("leadershipTeam", index, (item) => ({
                        ...item,
                        sortOrder: parseSortOrder(event.target.value)
                      }))
                    }
                  />
                </FormField>
              </div>

              <div className="mt-4">
                <FormField label="Description" required>
                  <TextArea
                    rows={3}
                    value={leader.description}
                    onChange={(event) => updateListItem("leadershipTeam", index, (item) => ({ ...item, description: event.target.value }))}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Services"
        title="Manage the service cards, service-page content, and footer service links."
        description="Each service entry powers the homepage, services page, and footer quick links."
        icon={BriefcaseBusiness}
        actions={(
          <SectionActions
            saving={savingSection === "services"}
            dirty={isDirty("services")}
            onReset={() => resetSection("services")}
            onSave={() => saveSection("services")}
          />
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Use short card copy and fuller service descriptions together.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => addListItem("services", createServiceItem(content.services))}
            className="gap-2"
          >
            <Plus size={16} />
            Add Service
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {content.services.map((service, index) => (
            <div key={`${service.slug}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moonext-orange">Service {index + 1}</p>
                  <p className="text-sm text-slate-600">Homepage and services-page entry</p>
                </div>
                <Button type="button" variant="danger" onClick={() => removeListItem("services", index)} className="gap-2">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Title" required>
                  <Input value={service.title} onChange={(event) => updateListItem("services", index, (item) => ({ ...item, title: event.target.value }))} />
                </FormField>
                <FormField label="Slug" required>
                  <Input value={service.slug} onChange={(event) => updateListItem("services", index, (item) => ({ ...item, slug: event.target.value }))} />
                </FormField>
                <FormField label="Icon" required hint="Use 2 to 4 letters for the service badge">
                  <Input value={service.icon} onChange={(event) => updateListItem("services", index, (item) => ({ ...item, icon: event.target.value.toUpperCase() }))} />
                </FormField>
                <FormField label="Sort Order" required>
                  <Input
                    type="number"
                    min={1}
                    value={service.sortOrder}
                    onChange={(event) =>
                      updateListItem("services", index, (item) => ({
                        ...item,
                        sortOrder: parseSortOrder(event.target.value)
                      }))
                    }
                  />
                </FormField>
              </div>

              <div className="mt-4 grid gap-4">
                <FormField label="Short Description" required>
                  <TextArea
                    rows={2}
                    value={service.shortDescription}
                    onChange={(event) => updateListItem("services", index, (item) => ({ ...item, shortDescription: event.target.value }))}
                  />
                </FormField>
                <FormField label="Full Description" required>
                  <TextArea
                    rows={4}
                    value={service.description}
                    onChange={(event) => updateListItem("services", index, (item) => ({ ...item, description: event.target.value }))}
                  />
                </FormField>
                <FormField label="Bullet Points" required hint="One line per bullet point">
                  <TextArea
                    rows={4}
                    value={service.bullets.join("\n")}
                    onChange={(event) => updateListItem("services", index, (item) => ({ ...item, bullets: splitLines(event.target.value) }))}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Projects"
        title="Control the public project showcase and individual project detail pages."
        description="Project cards, project counts, sitemap entries, and project detail content all use this section."
        icon={FileImage}
        actions={(
          <SectionActions
            saving={savingSection === "projects"}
            dirty={isDirty("projects")}
            onReset={() => resetSection("projects")}
            onSave={() => saveSection("projects")}
          />
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Projects should have a stable slug, image path, and clear detail-page content.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => addListItem("projects", createProjectItem(content.projects))}
            className="gap-2"
          >
            <Plus size={16} />
            Add Project
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {content.projects.map((project, index) => (
            <div key={`${project.slug}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moonext-orange">Project {index + 1}</p>
                  <p className="text-sm text-slate-600">Projects page and dynamic detail page</p>
                </div>
                <Button type="button" variant="danger" onClick={() => removeListItem("projects", index)} className="gap-2">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Title" required>
                  <Input value={project.title} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, title: event.target.value }))} />
                </FormField>
                <FormField label="Client / Project Name">
                  <Input
                    value={project.clientName ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, clientName: event.target.value }))}
                  />
                </FormField>
                <FormField label="Slug" required>
                  <Input value={project.slug} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, slug: event.target.value }))} />
                </FormField>
                <FormField label="Location" required>
                  <Input value={project.location} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, location: event.target.value }))} />
                </FormField>
                <FormField label="Image Path" required>
                  <Input value={project.image} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, image: event.target.value }))} />
                </FormField>
                <FormField label="Category" required>
                  <Input value={project.category} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, category: event.target.value }))} />
                </FormField>
                <FormField label="Client Category">
                  <Input
                    value={project.clientCategory ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, clientCategory: event.target.value }))}
                  />
                </FormField>
                <FormField label="Industry">
                  <Input
                    value={project.industry ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, industry: event.target.value }))}
                  />
                </FormField>
                <FormField label="Status" required>
                  <Input value={project.status} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, status: event.target.value }))} />
                </FormField>
                <FormField label="Year / Reference Period" required>
                  <Input value={project.year} onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, year: event.target.value }))} />
                </FormField>
                <FormField label="Sort Order" required>
                  <Input
                    type="number"
                    min={1}
                    value={project.sortOrder}
                    onChange={(event) =>
                      updateListItem("projects", index, (item) => ({
                        ...item,
                        sortOrder: parseSortOrder(event.target.value)
                      }))
                    }
                  />
                </FormField>
                <FormField label="Featured on homepage">
                  <label className="flex min-h-10 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={project.featured ?? false}
                      onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, featured: event.target.checked }))}
                    />
                    Show in the featured projects section
                  </label>
                </FormField>
              </div>

              <div className="mt-4 grid gap-4">
                <FormField label="Description" required>
                  <TextArea
                    rows={3}
                    value={project.description}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, description: event.target.value }))}
                  />
                </FormField>
                <FormField label="Summary" required>
                  <TextArea
                    rows={4}
                    value={project.summary}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, summary: event.target.value }))}
                  />
                </FormField>
                <FormField label="Scope of Work" hint="One line per scope point">
                  <TextArea
                    rows={4}
                    value={(project.scopeOfWork ?? []).join("\n")}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, scopeOfWork: splitLines(event.target.value) }))}
                  />
                </FormField>
                <FormField label="Key Highlights" hint="One line per project highlight">
                  <TextArea
                    rows={4}
                    value={(project.keyHighlights ?? []).join("\n")}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, keyHighlights: splitLines(event.target.value) }))}
                  />
                </FormField>
                <FormField label="Metrics" required hint="One line per metric shown on the project detail page">
                  <TextArea
                    rows={4}
                    value={project.metrics.join("\n")}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, metrics: splitLines(event.target.value) }))}
                  />
                </FormField>
                <FormField label="Safety & Quality Commitment">
                  <TextArea
                    rows={4}
                    value={project.safetyCommitment ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, safetyCommitment: event.target.value }))}
                  />
                </FormField>
                <FormField label="SEO Title">
                  <Input
                    value={project.seoTitle ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, seoTitle: event.target.value }))}
                  />
                </FormField>
                <FormField label="SEO Description">
                  <TextArea
                    rows={3}
                    value={project.seoDescription ?? ""}
                    onChange={(event) => updateListItem("projects", index, (item) => ({ ...item, seoDescription: event.target.value }))}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Gallery"
        title="Manage the construction gallery used on the public website."
        description="Gallery items can be expanded over time without changing the live gallery layout."
        icon={GalleryHorizontal}
        actions={(
          <SectionActions
            saving={savingSection === "galleryItems"}
            dirty={isDirty("galleryItems")}
            onReset={() => resetSection("galleryItems")}
            onSave={() => saveSection("galleryItems")}
          />
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Each item feeds the public gallery cards and counts.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => addListItem("galleryItems", createGalleryItem(content.galleryItems))}
            className="gap-2"
          >
            <Plus size={16} />
            Add Gallery Item
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {content.galleryItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moonext-orange">Gallery Item {index + 1}</p>
                  <p className="text-sm text-slate-600">Public gallery card</p>
                </div>
                <Button type="button" variant="danger" onClick={() => removeListItem("galleryItems", index)} className="gap-2">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Title" required>
                  <Input value={item.title} onChange={(event) => updateListItem("galleryItems", index, (entry) => ({ ...entry, title: event.target.value }))} />
                </FormField>
                <FormField label="Category" required>
                  <Input value={item.category} onChange={(event) => updateListItem("galleryItems", index, (entry) => ({ ...entry, category: event.target.value }))} />
                </FormField>
                <FormField label="Image Path" required>
                  <Input value={item.image} onChange={(event) => updateListItem("galleryItems", index, (entry) => ({ ...entry, image: event.target.value }))} />
                </FormField>
                <FormField label="Sort Order" required>
                  <Input
                    type="number"
                    min={1}
                    value={item.sortOrder}
                    onChange={(event) =>
                      updateListItem("galleryItems", index, (entry) => ({
                        ...entry,
                        sortOrder: parseSortOrder(event.target.value)
                      }))
                    }
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Building2;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Icon size={20} />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div>{actions}</div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function SectionActions({
  dirty,
  saving,
  onReset,
  onSave
}: {
  dirty: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="button" variant="secondary" onClick={onReset} disabled={!dirty || saving}>
        Reset
      </Button>
      <Button type="button" onClick={onSave} disabled={!dirty || saving} className="gap-2">
        <Save size={16} />
        {saving ? "Saving..." : "Save Section"}
      </Button>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-moonext-orange sm:text-sm"
    />
  );
}
