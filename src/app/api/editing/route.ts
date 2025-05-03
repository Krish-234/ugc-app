// app/api/editing/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Hardcoded test user ID (same as ads route)
const TEST_USER_ID = "test-user-1"

export async function GET() {
  try {
    const requests = await prisma.editingRequest.findMany({
      where: { userId: TEST_USER_ID },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching editing requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData } = body

    // Verify test user exists
    const user = await prisma.user.findUnique({
      where: { id: TEST_USER_ID }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      )
    }

    // Calculate estimated ready date (7 days from now)
    const estimatedReady = new Date()
    estimatedReady.setDate(estimatedReady.getDate() + 7)

    // Create the editing request
    const editingRequest = await prisma.editingRequest.create({
      data: {
        userId: TEST_USER_ID,
        projectName: formData.projectName,
        rawFootageUrl: formData.rawFootage,
        editingStyle: formData.editingStyle,
        instructions: formData.instructions,
        referenceLinks: formData.referenceLinks || null,
        desiredLength: formData.desiredLength,
        customLength: formData.customLength || null,
        status: "PENDING",
        progress: 0,
        estimatedReady,
        creditsUsed: 40
      }
    })

    // Deduct credits from user
    await prisma.user.update({
      where: { id: TEST_USER_ID },
      data: { credits: { decrement: editingRequest.creditsUsed } }
    })

    return NextResponse.json(editingRequest)
  } catch (error) {
    console.error('Error creating editing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}