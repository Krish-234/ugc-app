import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        ads: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        editingRequest: { 
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const formattedUsers = users.map(user => {
      const allRequests = [...user.ads, ...user.editingRequest];  // Changed here too
      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        totalRequests: allRequests.length,
        completedRequests: allRequests.filter(r => r.status === 'COMPLETED').length,
        lastRequest: allRequests.length > 0 
          ? allRequests.reduce((latest, current) => 
              new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            ).createdAt 
          : null,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}