// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper function to validate file type
const isValidFileType = (fileType: string, category: 'image' | 'video') => {
  if (category === 'image') {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(fileType);
  }
  if (category === 'video') {
    return ['video/mp4', 'video/webm', 'video/quicktime'].includes(fileType);
  }
  return false;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const url = new URL(request.url);
    const category = url.searchParams.get('category'); // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = category === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize/1024/1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type based on category
    if (category && !isValidFileType(file.type, category as 'image' | 'video')) {
      return NextResponse.json(
        { error: `Invalid ${category} file type` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads', category || '');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const fileUrl = `/uploads/${category ? `${category}/` : ''}${filename}`;
    return NextResponse.json({ url: fileUrl });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}