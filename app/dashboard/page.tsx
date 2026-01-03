// app/dashboard/page.tsx - REDIRECT TO CLIENT DASHBOARD
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  // Redirect based on user type
  if (profile?.user_type === 'client') {
    redirect('/client/dashboard')
  } else if (profile?.user_type === 'worker') {
    redirect('/worker/dashboard')
  }

  // Fallback
  redirect('/browse')
}