import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const requestId = formData.get('requestId') as string;
    const type = formData.get('type') as 'ad' | 'editing';
    const userId = formData.get('userId') as string;

    if (!file || !requestId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads', type, requestId);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    // Log the upload in database if needed
    await prisma.fileUpload.create({
      data: {
        filename,
        path: path.join(uploadDir, filename),
        requestId,
        userId,
        type,
      },
    });

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}