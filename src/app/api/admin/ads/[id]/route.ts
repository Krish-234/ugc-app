// app/api/admin/ads/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedFileUrl: `http://localhost:3000/uploads/ads/${id}.mp4`
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error completing ad:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}