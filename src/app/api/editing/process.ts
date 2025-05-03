// scripts/processEditing.ts
import { prisma } from '@/lib/prisma'

async function processEditingRequests() {
  console.log('Processing editing requests...')
  
  try {
    const pendingRequests = await prisma.editingRequest.findMany({
      where: { 
        status: { 
          in: ["PENDING", "PROCESSING"] 
        } 
      }
    })

    console.log(`Found ${pendingRequests.length} requests to process`)

    for (const request of pendingRequests) {
      // Simulate progress
      const newProgress = Math.min(request.progress + 15, 100)
      const newStatus = newProgress === 100 ? "COMPLETED" : "PROCESSING"
      
      // Mock completed file URL
      const completedFileUrl = newStatus === "COMPLETED" 
        ? `http://localhost:3000/uploads/edited-${request.id}.mp4` 
        : null

      await prisma.editingRequest.update({
        where: { id: request.id },
        data: {
          progress: newProgress,
          status: newStatus,
          completedFileUrl
        }
      })

      console.log(`Updated request ${request.id} to ${newProgress}%`)
    }
  } catch (error) {
    console.error('Error processing requests:', error)
  }
}

// Run immediately and then every hour
processEditingRequests()
setInterval(processEditingRequests, 60 * 60 * 1000)