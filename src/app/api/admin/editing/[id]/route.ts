// app/api/admin/editing/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUploadedFiles } from '@/lib/storage' 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const files = await getUploadedFiles(`editing/${params.id}`);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { selectedFile } = await request.json();
    const fileUrl = `/uploads/editing/${params.id}/${selectedFile}`;

    const editingRequest = await prisma.editingRequest.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedFileUrl: fileUrl
      }
    });

    return NextResponse.json(editingRequest);
  } catch (error) {
    console.error('Error completing editing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}