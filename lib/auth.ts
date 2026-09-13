import { Role } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

const cookieName = "moonext_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export type SessionPayload = {
  userId: string;
  role: Role;
  fullName?: string;
  email?: string;
  siteId?: string | null;
  contractorId?: string | null;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  siteId: string | null;
  contractorId: string | null;
};

type SessionUser = Pick<AuthUser, "id" | "fullName" | "email" | "role" | "siteId" | "contractorId">;

const getAuthUserById = cache(async (userId: string): Promise<AuthUser | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      siteId: true,
      contractorId: true
    }
  });
});

function getAuthUserFromSession(session: SessionPayload): AuthUser | null {
  if (!session.fullName || !session.email) return null;

  return {
    id: session.userId,
    fullName: session.fullName,
    email: session.email,
    role: session.role,
    siteId: session.siteId ?? null,
    contractorId: session.contractorId ?? null
  };
}

export function getSessionPayload(user: SessionUser): SessionPayload {
  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    siteId: user.siteId,
    contractorId: user.contractorId
  };
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setAuthCookieForUser(user: SessionUser) {
  const token = await createToken(getSessionPayload(user));
  await setAuthCookie(token);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUserFromRequest(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return null;
  return getAuthUserFromSession(session) ?? getAuthUserById(session.userId);
}

export function hasRole(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  const session = await verifyToken(token);
  if (!session) return null;
  return getAuthUserFromSession(session) ?? getAuthUserById(session.userId);
}
