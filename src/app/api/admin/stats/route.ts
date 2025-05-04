import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [ads, editingRequests] = await Promise.all([
      prisma.ad.findMany(),
      prisma.editingRequest.findMany(),
    ]);

    const allRequests = [...ads, ...editingRequests];
    const totalRequests = allRequests.length;
    const completedRequests = allRequests.filter(r => r.status === 'COMPLETED').length;
    const pendingRequests = totalRequests - completedRequests;

    return NextResponse.json({
      totalRequests,
      completedRequests,
      pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}