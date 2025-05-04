// app/api/admin/upload-final/route.ts
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

    if (!file || !requestId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the final filename based on request ID
    const fileExtension = file.name.split('.').pop();
    const finalFilename = `${requestId}.${fileExtension}`;
    
    // Define the final upload path
    const uploadDir = path.join(process.cwd(), 'public/uploads', type);
    const finalPath = path.join(uploadDir, finalFilename);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write the file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(finalPath, buffer);

    // Generate the public URL
    const fileUrl = `/uploads/${type}/${finalFilename}`;

    // Update the appropriate database record
    if (type === 'ad') {
      await prisma.ad.update({
        where: { id: requestId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedFileUrl: fileUrl,
        },
      });
    } else {
      await prisma.editingRequest.update({
        where: { id: requestId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedFileUrl: fileUrl,
        },
      });
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Final upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}