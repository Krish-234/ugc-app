// components/FileSelectionDialog.tsx
'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface FileSelectionDialogProps {
  children: React.ReactNode;
  requestId: string;
  type: 'ad' | 'editing';
  onComplete: () => void;
  userId?: string;  // Add userId as optional prop
}

export function FileSelectionDialog({
  children,
  requestId,
  type,
  onComplete,
  userId,  // Destructure userId
}: FileSelectionDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId);
      formData.append('type', type);
      if (userId) formData.append('userId', userId);  // Use userId if provided

      const response = await fetch(`/api/admin/upload-final`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast({
        title: 'Success',
        description: 'Final file uploaded successfully',
      });
      onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload final file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Final File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Final Version
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}