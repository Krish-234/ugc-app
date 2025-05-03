// app/admin/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function AdminLogin() {
  const router = useRouter()

  useEffect(() => {
    const username = prompt('Enter admin username:')
    const password = prompt('Enter admin password:')
    
    if (
      username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      router.push('/admin')
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid admin credentials',
        variant: 'destructive',
      })
      router.push('/')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying admin credentials...</p>
    </div>
  )
}