"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Building2,
  ChartBar,
  ClipboardList,
  FileDown,
  HardHat,
  Home,
  IndianRupee,
  Package,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/sites", label: "Sites", icon: Building2 },
  { href: "/dashboard/workers", label: "Workers", icon: HardHat },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/dashboard/contractors", label: "Contractors", icon: Users },
  { href: "/dashboard/payroll", label: "Payroll", icon: IndianRupee },
  { href: "/dashboard/materials", label: "Materials", icon: Package },
  { href: "/dashboard/ai", label: "AI Insights", icon: BrainCircuit },
  { href: "/dashboard/reports", label: "Reports", icon: FileDown },
  { href: "/dashboard/users", label: "Users", icon: ChartBar }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-slate-200 bg-moonext-navy p-4 text-white md:w-64">
      <h2 className="mb-6 text-lg font-semibold">Moonext LMS</h2>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-moonext-orange text-white" : "hover:bg-blue-900"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
