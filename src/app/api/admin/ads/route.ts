import { NextRequest, NextResponse } from "next/server";
import {prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get("session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    console.log(userId)

    // Get ads for the user
    const ads = await prisma.ad.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}