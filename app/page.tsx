
// app/page.tsx
import LandingPageClient from './LandingPageClient'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'

export default async function HomePage() {
  // Check if user is logged in
  const user = await getUser()
  
  if (user) {
    const profile = await getProfile()
    
    // Redirect based on user type
    if (profile?.user_type === 'worker') {
      redirect('/worker/dashboard')
    } else if (profile?.user_type === 'client') {
      redirect('/browse')
    } else {
      // Default to browse if user_type not set
      redirect('/browse')
    }
  }

  // If not logged in, show landing page
  return <LandingPageClient />
}