// app/worker/jobs/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkerNavigation from '@/components/WorkerNavigation'
import JobCard from '@/components/JobCard'

export default async function WorkerJobsPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const supabase = await createServerSupabaseClient()

  // Get worker's services to match jobs
  const { data: services } = await supabase
    .from('services')
    .select('category')
    .eq('worker_id', profile.id)

  const categories = services?.map(s => s.category) || []

  // Get available jobs matching worker's services
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
    .limit(20)

  // Get saved job IDs
  const { data: savedInteractions } = await supabase
    .from('interactions')
    .select('job_post_id')
    .eq('worker_id', profile.id)
    .eq('interaction_type', 'saved')

  const savedJobIds = savedInteractions?.map(i => i.job_post_id) || []

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Available Jobs</h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                {jobs?.length || 0} Jobs
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Link
            href="/worker/jobs"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm whitespace-nowrap shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            All Jobs ({jobs?.length || 0})
          </Link>
          <Link
            href="/worker/jobs/saved"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved ({savedJobIds.length})
          </Link>
        </div>

        {/* Jobs List */}
        {jobs && jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job: any) => (
              <JobCard 
                key={job.id} 
                job={job} 
                workerId={profile.id}
                isSaved={savedJobIds.includes(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Jobs Available
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              There are no jobs matching your services right now.
            </p>
            <Link
              href="/worker/services"
              className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              Update Your Services
            </Link>
          </div>
        )}
      </main>

      <WorkerNavigation />
    </div>
  )
}