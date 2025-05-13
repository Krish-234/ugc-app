// app/api/ads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
  try {
    // Authentication check (same as before)
    const sessionToken = request.cookies.get("session-token")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findFirst({
      where: { sessionToken, expires: { gt: new Date() } },
      include: { user: true },
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { formData, selectedScript, serviceType } = body;

    // Validate required fields
    if (!serviceType || !formData?.brandName || !formData?.productName || !selectedScript) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate estimated ready date
    const estimatedReady = new Date();
    estimatedReady.setDate(estimatedReady.getDate() + 7);

    // Create ad within a transaction
    const [ad] = await prisma.$transaction([
      prisma.ad.create({
        data: {
          userId,
          serviceType,
          avatar: formData.avatar || null,
          brandName: formData.brandName,
          productName: formData.productName,
          productImage: formData.productImage || null,
          description: formData.productDescription || '',
          targetAudience: formData.targetAudience || '',
          videoDuration: formData.videoDuration || '30',
          selectedTones: formData.selectedTones || [],
          script: selectedScript,
          websiteLink: formData.websiteLink || null,
          referenceLink: formData.referenceLink || null,
          status: 'PENDING',
          progress: 0,
          estimatedReady,
          creditsUsed: 30
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 30 } }
      })
    ]);

    return NextResponse.json(ad);
    
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}