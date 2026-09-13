import Link from "next/link";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function Topbar() {
  const user = await getCurrentUserFromCookie();
  const roleLabel = user?.role ? user.role.replaceAll("_", " ") : "Guest";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Welcome back</p>
          <h1 className="truncate text-lg font-semibold text-moonext-slate sm:text-xl">{user?.fullName ?? "User"}</h1>
          <p className="mt-1 text-xs text-slate-500">{roleLabel}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            {roleLabel}
          </span>
          <Link
            href="/dashboard/settings"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 sm:min-h-11"
          >
            Settings
          </Link>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">Logout</Button>
          </form>
        </div>
      </div>
    </header>
  );
}
