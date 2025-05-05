-- CreateTable
CREATE TABLE "Session" (
    "sessiontoken" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessiontoken")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_sessiontoken_fkey" FOREIGN KEY ("sessiontoken") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
