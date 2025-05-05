// File: middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get("session-token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Find valid session
    const session = await prisma.session.findFirst({
      where: {
        sessionToken,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(request, user);
}