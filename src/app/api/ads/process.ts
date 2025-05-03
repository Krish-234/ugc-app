// scripts/processAds.ts
import { prisma } from "@/lib/prisma";

async function processAds() {
  const pendingAds = await prisma.ad.findMany({
    where: { status: "PENDING" },
  });

  for (const ad of pendingAds) {
    const newProgress = Math.min(ad.progress + 10, 100);
    const newStatus = newProgress === 100 ? "COMPLETED" : "PROCESSING";

    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        progress: newProgress,
        status: newStatus,
      },
    });

    console.log(`Updated ad ${ad.id} to ${newProgress}%`);
  }
}

// Run immediately and then every hour
processAds();
setInterval(processAds, 60 * 60 * 1000);