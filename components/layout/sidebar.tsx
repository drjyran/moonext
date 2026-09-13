"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-b border-slate-200 bg-moonext-navy text-white md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)] md:w-64 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="px-4 py-4 md:py-6">
        <div className="mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-blue-200">Moonext</p>
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-moonext-orange text-white"
                    : "text-slate-100 hover:bg-blue-900"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
