/*
  Warnings:

  - Added the required column `estimatedReady` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetAudience` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoDuration` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "estimatedReady" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productImage" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referenceLink" TEXT,
ADD COLUMN     "script" TEXT,
ADD COLUMN     "selectedTones" TEXT[],
ADD COLUMN     "serviceType" TEXT NOT NULL,
ADD COLUMN     "targetAudience" TEXT NOT NULL,
ADD COLUMN     "videoDuration" TEXT NOT NULL,
ADD COLUMN     "websiteLink" TEXT;
