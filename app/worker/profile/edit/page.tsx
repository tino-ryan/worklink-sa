// app/worker/profile/edit/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import ProfileEditForm from '@/components/ProfileEditForm'

export default async function WorkerProfileEditPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">
            <Link 
              href="/worker/profile" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <ProfileEditForm profile={profile} />
      </main>
    </div>
  )
}

