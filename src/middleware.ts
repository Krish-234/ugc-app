// middleware.js (or middleware.ts if using TypeScript)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = request.nextUrl

  // Only protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    // Check for basic auth header
    if (!authHeader) {
      // Prompt for basic auth
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
          'Content-Type': 'text/plain',
        },
      })
    }

    // Verify credentials
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const username = auth[0]
    const password = auth[1]

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Dashboard"' },
      })
    }
  }

  return NextResponse.next()
}

// Specify which paths should use this middleware
export const config = {
  matcher: ['/admin/:path*'],
}