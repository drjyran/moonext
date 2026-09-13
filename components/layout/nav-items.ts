import {
  BrainCircuit,
  Building2,
  ChartBar,
  ClipboardList,
  FileDown,
  Globe2,
  HardHat,
  Home,
  IndianRupee,
  Package,
  Settings,
  Users
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/sites", label: "Sites", icon: Building2 },
  { href: "/dashboard/workers", label: "Workers", icon: HardHat },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/dashboard/contractors", label: "Contractors", icon: Users },
  { href: "/dashboard/payroll", label: "Payroll", icon: IndianRupee },
  { href: "/dashboard/materials", label: "Materials", icon: Package },
  { href: "/dashboard/ai", label: "AI Insights", icon: BrainCircuit },
  { href: "/dashboard/reports", label: "Reports", icon: FileDown },
  { href: "/dashboard/website", label: "Website", icon: Globe2 },
  { href: "/dashboard/users", label: "Users", icon: ChartBar },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];
