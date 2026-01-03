// app/worker/photos/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkerNavigation from '@/components/WorkerNavigation'
import PhotoUploadZone from '@/components/PhotoUploadZone'
import WorkPhotoCard from '@/components/WorkPhotoCard'

export default async function WorkerPhotosPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const supabase = await createServerSupabaseClient()

  // Get work photos
  const { data: workPhotos } = await supabase
    .from('work_photos')
    .select('*')
    .eq('worker_id', profile.id)
    .order('uploaded_at', { ascending: false })

  const photoCount = workPhotos?.length || 0
  const canAddMore = photoCount < 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-purple-100 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/worker/profile" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Work Gallery</h1>
            <div className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              {photoCount}/5
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Upload Section */}
        {canAddMore && (
          <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Upload Work Photos</h2>
                <p className="text-sm text-gray-600">Show your best work to attract clients</p>
              </div>
            </div>

            <PhotoUploadZone 
                workerId={profile.id} 
                userId={user.id}
                currentCount={photoCount} 
                />
          </div>
        )}

        {/* Photos Grid */}
        {workPhotos && workPhotos.length > 0 ? (
          <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workPhotos.map((photo) => (
                <WorkPhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Photos Yet</h3>
            <p className="text-gray-600 mb-6">Upload photos of your work to build trust with clients</p>
          </div>
        )}

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-blue-900 mb-2">
                Photo Tips for Success
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span><strong>Use good lighting</strong> - Take photos during the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span><strong>Show completed work</strong> - Focus on finished projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span><strong>Take close-ups</strong> - Show details of your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span><strong>Add captions</strong> - Describe what you did</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span><strong>Maximum 5 photos</strong> - Choose your best work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <WorkerNavigation />
    </div>
  )
}