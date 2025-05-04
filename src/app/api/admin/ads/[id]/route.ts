// app/api/admin/ads/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUploadedFiles } from '@/lib/storage'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const files = await getUploadedFiles(`ads/${params.id}`);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching ad files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { selectedFile } = await request.json();
    const fileUrl = `/uploads/ads/${params.id}/${selectedFile}`;

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedFileUrl: fileUrl
      }
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Error completing ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}