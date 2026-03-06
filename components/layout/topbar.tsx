import { getCurrentUserFromCookie } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Topbar() {
  const user = await getCurrentUserFromCookie();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-xs text-slate-500">Welcome back</p>
        <h1 className="text-lg font-semibold text-moonext-slate">{user?.fullName ?? "User"}</h1>
      </div>
      <form action="/api/auth/logout" method="post">
        <Button type="submit" variant="secondary">Logout</Button>
      </form>
    </header>
  );
}
