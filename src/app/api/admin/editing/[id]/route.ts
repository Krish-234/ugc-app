// app/api/admin/editing/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const editingRequest = await prisma.editingRequest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedFileUrl: `http://localhost:3000/uploads/editing/${id}.mp4`
      }
    })

    return NextResponse.json(editingRequest)
  } catch (error) {
    console.error('Error completing editing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}