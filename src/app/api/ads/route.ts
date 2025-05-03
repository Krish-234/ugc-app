// app/api/ads/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TEST_USER_ID = "test-user-1"

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      where: { userId: TEST_USER_ID },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, selectedScript, serviceType } = body

    // Verify test user exists
    console.log(TEST_USER_ID);
    const user = await prisma.user.findUnique({
      where: { id: TEST_USER_ID }
    })

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      )
    }

    // Calculate estimated ready date
    const estimatedReady = new Date()
    estimatedReady.setDate(estimatedReady.getDate() + 7)

    // Create ad
    const ad = await prisma.ad.create({
      data: {
        userId: TEST_USER_ID,
        serviceType,
        avatar: formData.avatar,
        brandName: formData.brandName,
        productName: formData.productName,
        productImage: formData.productImage,
        description: formData.productDescription,
        targetAudience: formData.targetAudience,
        videoDuration: formData.videoDuration,
        selectedTones: formData.selectedTones,
        script: selectedScript,
        websiteLink: formData.websiteLink || null,
        referenceLink: formData.referenceLink || null,
        status: 'PENDING',
        progress: 0,
        estimatedReady,
        creditsUsed: 30
      }
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: TEST_USER_ID },
      data: { credits: { decrement: ad.creditsUsed } }
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}