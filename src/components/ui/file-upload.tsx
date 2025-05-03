// components/FileUpload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  endpoint: string;
  onChange: (url?: string) => void;
  value?: string;
  accept?: string;
}

export const FileUpload = ({
  endpoint = '/api/upload',
  onChange,
  value,
  accept = '*/*', // Default to accept all file types
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { url } = await response.json();
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" disabled={isUploading}>
          <label className="cursor-pointer">
            {isUploading ? 'Uploading...' : 'Select File'}
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </Button>
        {value && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {value.split('/').pop()}
            </span>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View
            </a>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};