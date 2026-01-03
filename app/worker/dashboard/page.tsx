// app/worker/dashboard/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import WorkerNavigation from '@/components/WorkerNavigation'
import AvailabilityToggle from '@/components/AvailabilityToggle'

export default async function WorkerDashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const supabase = await createServerSupabaseClient()

  // Check if profile is complete
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('worker_id', profile.id)

  const isProfileComplete = services && services.length > 0

  // Get availability status
  const { data: availability } = await supabase
    .from('availability')
    .select('available_today')
    .eq('worker_id', profile.id)
    .maybeSingle()

  // Get available jobs matching worker's services
  const categories = services?.map(s => s.category) || []
  const { data: jobs } = await supabase
    .from('job_posts')
    .select(`
      *,
      profiles:client_id (
        full_name,
        profile_photo_url,
        phone_number
      )
    `)
    .eq('status', 'open')
    .in('category', categories.length > 0 ? categories : [''])
    .order('created_at', { ascending: false })
    .limit(5)

  // Get saved job IDs
  const { data: savedInteractions } = await supabase
    .from('interactions')
    .select('job_post_id')
    .eq('worker_id', profile.id)
    .eq('interaction_type', 'saved')

  const savedJobIds = savedInteractions?.map(i => i.job_post_id) || []

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  WorkLink
                </span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {profile.profile_photo_url ? (
                  <img 
                    src={profile.profile_photo_url} 
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-gray-200">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {profile.full_name}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Completion Warning */}
        {!isProfileComplete && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Complete Your Profile</h3>
                <p className="text-sm text-gray-700 mb-3">Add services to start appearing in search results.</p>
                <Link
                  href="/worker/onboarding"
                  className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium transition-all text-sm shadow-sm"
                >
                  Complete Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {profile.full_name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600 text-sm">Here&apos;s your dashboard overview</p>
        </div>

        {/* Availability Toggle - Compact */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {availability?.available_today ? 'Available for work' : 'Not available'}
                </p>
                <p className="text-xs text-gray-500">
                  {availability?.available_today ? 'Visible to clients' : 'Hidden from search'}
                </p>
              </div>
            </div>
            <AvailabilityToggle 
              workerId={profile.id}
              initialStatus={availability?.available_today || false}
            />
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            href="/worker/availability"
            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            <svg className="w-7 h-7 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-bold">Schedule</p>
          </Link>
          
          <Link
            href="/worker/profile"
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            <svg className="w-7 h-7 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-xs font-bold">Profile</p>
          </Link>
          
          <Link
            href="/worker/photos"
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            <svg className="w-7 h-7 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-bold">Photos</p>
          </Link>
        </div>

        {/* Available Jobs Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Available Jobs</h3>
            </div>
            <Link 
              href="/worker/jobs"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {jobs && jobs.length > 0 ? (
              jobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/worker/jobs/${job.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{job.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{job.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                          {job.category}
                        </span>
                        {job.budget && (
                          <span className="text-xs text-gray-500 font-medium">
                            R{job.budget}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-400">
                      <svg className="w-5 h-5" fill={savedJobIds.includes(job.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  No jobs available right now
                </p>
                <p className="text-xs text-gray-500">
                  Check back soon for new opportunities
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Your Services Section */}
        {services && services.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Your Services</h3>
              </div>
              <Link 
                href="/worker/services"
                className="text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Manage →
              </Link>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {services.map((service: any) => (
                  <div key={service.id} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                    {service.category}
                  </div>
                ))}
                <Link
                  href="/worker/services"
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-dashed border-gray-300 hover:bg-gray-100"
                >
                  + Add Service
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-900 mb-1">Pro Tip</h3>
              <p className="text-sm text-blue-800">
                Workers who keep their availability updated get 3x more job requests!
              </p>
            </div>
          </div>
        </div>
      </main>

      <WorkerNavigation />
    </div>
  )
}