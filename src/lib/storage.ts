// lib/storage.ts
import fs from 'fs/promises';
import path from 'path';

export async function getUploadedFiles(directory: string) {
  try {
    const uploadPath = path.join(process.cwd(), 'public/uploads', directory);
    const files = await fs.readdir(uploadPath);
    return { files };
  } catch (error) {
    console.error('Error reading directory:', error);
    return { files: [] };
  }
}