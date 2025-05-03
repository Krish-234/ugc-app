// types/uploadthing.d.ts
import type { OurFileRouter } from "@/app/api/upload/core";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace UploadThing {
    type Router = OurFileRouter;
  }
}