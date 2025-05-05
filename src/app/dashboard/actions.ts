"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";

const prisma = new PrismaClient();

// Type definition for session response
export type SessionUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  credits: number;
} | null;

/**
 * Gets the current authenticated user's session
 * This is cached to avoid duplicate database calls within the same request
 */
export const getSession = cache(async (): Promise<SessionUser> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findFirst({
      where: {
        sessionToken,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            credits: true,
          },
        },
      },
    });

    if (!session || !session.user) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
});

/**
 * A higher-order function to protect routes
 * If user is not authenticated, they are redirected to the login page
 */
export async function requireAuth(redirectUrl = "/login") {
  const user = await getSession();
  
  if (!user) {
    redirect(redirectUrl);
  }
  
  return user;
}

/**
 * A higher-order function to protect admin routes
 * If user is not an admin, they are redirected to the home page
 */
export async function requireAdmin(redirectUrl = "/") {
  const user = await getSession();
  
  if (!user || user.role !== "ADMIN") {
    redirect(redirectUrl);
  }
  
  return user;
}