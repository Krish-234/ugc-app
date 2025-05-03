// types/uploadthing.d.ts
import type { OurFileRouter } from "@/app/api/uploadthing/core";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace UploadThing {
    type Router = OurFileRouter;
  }
}