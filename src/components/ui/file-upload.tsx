// components/ui/file-upload.tsx
"use client";

import { UploadDropzone } from "./upload-dropzone";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  endpoint: keyof OurFileRouter;
  value: string;
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      value={value}
      onChange={onChange}
      className="border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors"
    />
  );
};