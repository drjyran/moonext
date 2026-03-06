import { Role, type User } from "@prisma/client";

export function enforceScope<T extends { assignedSiteId?: string | null; contractorId?: string | null }>(
  user: User,
  item: T
) {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.SITE_MANAGER) return item.assignedSiteId === user.siteId;
  if (user.role === Role.CONTRACTOR) return item.contractorId === user.contractorId;
  return false;
}

export function canAccessSite(user: User, siteId: string) {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.SITE_MANAGER) return user.siteId === siteId;
  return false;
}
