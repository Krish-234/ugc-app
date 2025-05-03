-- CreateTable
CREATE TABLE "EditingRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "rawFootageUrl" TEXT NOT NULL,
    "editingStyle" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "referenceLinks" TEXT,
    "desiredLength" TEXT NOT NULL,
    "customLength" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "estimatedReady" TIMESTAMP(3) NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedFileUrl" TEXT,

    CONSTRAINT "EditingRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditingRequest" ADD CONSTRAINT "EditingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
