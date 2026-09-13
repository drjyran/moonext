import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { WebsiteContentManager } from "@/components/dashboard/website-content-manager";
import { getCurrentUserFromCookie } from "@/lib/auth";

export default async function WebsiteDashboardPage() {
  const user = await getCurrentUserFromCookie();

  if (!user || user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return <WebsiteContentManager />;
}
