"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/lib/company-content";
import type { CompanyInfoContent } from "@/lib/website-content";

type HeaderUser = {
  fullName: string;
  role: string;
} | null;

type Props = {
  companyInfo: CompanyInfoContent;
  user: HeaderUser;
  isInternalRoute: boolean;
};

export function SiteHeader({ companyInfo, user, isInternalRoute }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAuthenticated = !!user;

  const coreLinks = navigationLinks.map((item) => ({
    ...item,
    active:
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
  }));

  return (
    <header className="site-shell-header sticky top-0 z-40 border-b border-white/50 bg-[rgba(248,245,239,0.82)] shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/60 bg-[linear-gradient(135deg,#0f172a_0%,#1f3d70_100%)] text-sm font-black tracking-[0.2em] text-white shadow-[0_14px_35px_rgba(15,23,42,0.24)]">
              M
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.3em] text-moonext-orange">Construction & Site Operations</p>
              <p className="public-display truncate text-base font-semibold text-slate-950 md:text-[1.05rem]">{companyInfo.name}</p>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:flex">
          {coreLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                item.active
                  ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)]"
                  : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition",
                  isInternalRoute
                    ? "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-white shadow-[0_14px_35px_rgba(249,115,22,0.3)] hover:brightness-105"
                    : "border border-slate-200 bg-white text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:bg-slate-50"
                )}
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout?redirectTo=/" method="post">
                <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300/90 bg-white/70 px-4 text-sm font-semibold text-slate-700 transition hover:bg-white">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/staff-access"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
            >
              Staff Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-300/90 bg-white/70 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:bg-white lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/60 bg-[rgba(248,245,239,0.94)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] lg:hidden">
          <div className="grid gap-2">
            {coreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[22px] px-4 py-3 text-sm font-medium transition",
                  item.active ? "bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]" : "bg-white text-slate-700 hover:bg-slate-100"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-[22px] bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout?redirectTo=/" method="post">
                  <button className="w-full rounded-[22px] border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/staff-access"
                className="rounded-[22px] bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(249,115,22,0.28)] transition hover:brightness-105"
                onClick={() => setOpen(false)}
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
