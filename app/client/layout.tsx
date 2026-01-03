// app/client/layout.tsx
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import ClientNavWrapper from '@/components/ClientNavWrapper'

export default async function ClientLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (!profile) {
    redirect('/auth/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ClientNavWrapper profile={profile} />
      {children}
    </div>
  )
}
