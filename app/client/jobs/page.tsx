// app/client/jobs/page.tsx
import Link from 'next/link'
import { getClientJobs } from '@/app/actions/client'

export default async function ClientJobsPage() {
  const { jobs, error } = await getClientJobs()

  const openJobs = jobs?.filter(j => j.status === 'open') || []
  const filledJobs = jobs?.filter(j => j.status === 'filled') || []

  return (
    <div className="pb-24 md:pb-6">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <Link
            href="/client/post-job"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post New Job
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && jobs?.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No Jobs Yet</h2>
            <p className="text-gray-600 text-sm mb-4">Post your first job to get started</p>
            <Link
              href="/client/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post First Job
            </Link>
          </div>
        )}

        {/* Open Jobs */}
        {openJobs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-bold text-gray-900">Open ({openJobs.length})</h2>
            </div>
            <div className="space-y-3">
              {openJobs.map((job) => (
                <CompactJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Filled Jobs */}
        {filledJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Filled ({filledJobs.length})</h2>
            </div>
            <div className="space-y-3">
              {filledJobs.map((job) => (
                <CompactJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function CompactJobCard({ job }: { job: any }) {
  const dateNeeded = new Date(job.date_needed).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short'
  })

  const isOpen = job.status === 'open'

  return (
    <Link href={`/client/jobs/${job.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 capitalize truncate">
                {job.category}
              </h3>
              {isOpen && job.interested_count > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  {job.interested_count}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{dateNeeded}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {job.budget_min && job.budget_max && (
              <div className="text-right">
                <div className="text-base font-bold text-emerald-600">
                  R{job.budget_min}-{job.budget_max}
                </div>
              </div>
            )}
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              isOpen 
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {isOpen ? 'Active' : 'Filled'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}