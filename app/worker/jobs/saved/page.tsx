// app/worker/jobs/saved/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { getSavedJobs } from '@/app/actions/worker'
import WorkerNavigation from '@/components/WorkerNavigation'
import JobCard from '@/components/JobCard'

export default async function SavedJobsPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const result = await getSavedJobs()
  const savedJobs = result.jobs || []

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/worker/jobs" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Saved Jobs</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {savedJobs.length > 0 ? (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-1">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <p className="text-sm text-blue-800 font-medium">
                  You have <strong>{savedJobs.length}</strong> saved job{savedJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {savedJobs.map((job: any) => (
              <JobCard 
                key={job.id} 
                job={job} 
                workerId={profile.id}
                isSaved={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Saved Jobs
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Tap the bookmark icon on any job to save it for later
            </p>
            <Link
              href="/worker/jobs"
              className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              Browse Available Jobs
            </Link>
          </div>
        )}
      </main>

      <WorkerNavigation />
    </div>
  )
}