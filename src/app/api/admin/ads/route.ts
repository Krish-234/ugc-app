import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const requests = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' }
    })
    console.log(requests);
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching editing requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
