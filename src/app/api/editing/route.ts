import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get requests for the authenticated user
    const requests = await prisma.editingRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching editing requests:', error);
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
    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { formData } = body;

    // Validate required fields
    if (!formData?.projectName || !formData?.rawFootageUrl || !formData?.editingStyle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate estimated ready date
    const estimatedReady = new Date();
    estimatedReady.setDate(estimatedReady.getDate() + 7);

    // Use transaction for atomic operations
    const [editingRequest] = await prisma.$transaction([
      prisma.editingRequest.create({
        data: {
          userId,
          projectName: formData.projectName,
          rawFootageUrl: formData.rawFootageUrl,
          editingStyle: formData.editingStyle,
          instructions: formData.instructions || null,
          referenceLinks: formData.referenceLinks || null,
          desiredLength: formData.desiredLength,
          customLength: formData.customLength || null,
          status: 'PENDING',
          progress: 0,
          estimatedReady,
          creditsUsed: 40
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 40 } }
      })
    ]);

    return NextResponse.json(editingRequest);
  } catch (error) {
    console.error('Error creating editing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}