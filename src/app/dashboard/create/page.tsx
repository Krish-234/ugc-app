"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdCreationForm } from "@/components/dashboard/AdCreationForm";
import { VideoEditingForm } from "@/components/dashboard/VideoEditingForm";

export default function CreateAdPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAdPageContent />
    </Suspense>
  );
}

function CreateAdPageContent() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("type");

  const isVideoEditing = serviceType === "video-editing";

  return isVideoEditing ? <VideoEditingForm /> : <AdCreationForm serviceType={serviceType} />;
}