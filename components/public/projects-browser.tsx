"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectContent } from "@/lib/website-content";

const statusOptions = ["All", "Ongoing", "Completed"] as const;

type Props = {
  projects: ProjectContent[];
};

export function ProjectsBrowser({ projects }: Props) {
  const categoryOptions = useMemo(() => {
    const values = new Set<string>(["All"]);

    for (const project of projects) {
      values.add(project.category);
      if (project.clientCategory) {
        values.add(project.clientCategory);
      }
    }

    return ["All", ...Array.from(values).filter((value) => value !== "All").sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");
  const activeCategory = categoryOptions.includes(category) ? category : "All";

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const categoryMatch =
          activeCategory === "All" || project.category === activeCategory || project.clientCategory === activeCategory;
        const statusMatch = status === "All" || project.status === status;
        return categoryMatch && statusMatch;
      }),
    [activeCategory, projects, status]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === option ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${status === option ? "bg-moonext-orange text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <article key={project.slug} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative h-60">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>{project.category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{project.status}</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-1 text-sm font-medium text-moonext-navy">{project.location}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">{project.description}</p>
              <Link href={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700">
                View Project
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
