// app/worker/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkerPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/worker/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}