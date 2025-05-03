// components/ui/upload-dropzone.tsx
"use client";

import { UploadDropzone as UploadDropzonePrimitive } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "@/hooks/use-toast";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface UploadDropzoneProps {
  endpoint: keyof OurFileRouter;
  value: string;
  onChange: (url?: string) => void;
  className?: string;
}

export const UploadDropzone = ({
  endpoint,
  value,
  onChange,
  className,
}: UploadDropzoneProps) => {
  if (value) {
    return (
      <div className={`relative ${className}`}>
        {value.match(/\.(jpeg|jpg|gif|png)$/) ? (
          <div className="relative h-48 w-full">
            <Image
              fill
              src={value}
              alt="Upload"
              className="object-contain rounded-md"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
            <FileIcon className="h-10 w-10 text-primary" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-primary hover:underline"
            >
              View uploaded file
            </a>
          </div>
        )}
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzonePrimitive<OurFileRouter, "imageUpload" | "videoUpload">
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast({
          title: "Upload Error",
          description: error.message,
          variant: "destructive",
        });
      }}
      className={`ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ${className}`}
      config={{
        mode: "auto",
      }}
    />
  );
};