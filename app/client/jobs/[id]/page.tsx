// app/client/jobs/[id]/page.tsx
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import JobManagementActions from '@/components/JobManagementActions'
import Image from 'next/image'

export default async function JobManagementPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const user = await getUser()
  const profile = await getProfile()
  
  if (!user || profile?.user_type !== 'client') {
    redirect('/auth/login')
  }

  const supabase = await createServerSupabaseClient()

  // Get job details
  const { data: job, error } = await supabase
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .eq('client_id', profile.id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Get interested workers
  const { data: interactions } = await supabase
    .from('interactions')
    .select(`
      id,
      created_at,
      comment,
      worker_id,
      profiles:worker_id (
        id,
        full_name,
        profile_photo_url,
        phone_number,
        bio,
        average_rating,
        total_jobs,
        primary_location,
        services (category, price_min, price_max, pricing_type)
      )
    `)
    .eq('job_post_id', id)
    .eq('interaction_type', 'interested')
    .order('created_at', { ascending: false })

  const interestedWorkers = interactions || []

  const dateNeeded = new Date(job.date_needed).toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="pb-24 md:pb-6">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/client/jobs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Manage Job</h1>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900 capitalize">{job.category}</h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  job.status === 'open'
                    ? 'bg-emerald-100 text-emerald-700'
                    : job.status === 'filled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.status === 'open' ? 'Active' : job.status === 'filled' ? 'Filled' : 'Cancelled'}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-semibold text-gray-900">{job.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-gray-900">{dateNeeded}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-900 capitalize">{job.time_preference}</span>
            </div>

            {job.budget_min && job.budget_max && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-emerald-600">
                  R{job.budget_min}-{job.budget_max}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <JobManagementActions jobId={job.id} status={job.status} />
        </div>

        {/* Interested Workers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              Interested Workers ({interestedWorkers.length})
            </h3>
          </div>

          {interestedWorkers.length > 0 ? (
            <div className="space-y-3">
              {interestedWorkers.map((interaction: any) => {
                const worker = interaction.profiles
                const service = worker.services?.[0]
                
                return (
                  <div key={interaction.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:border-emerald-500 transition-colors">
                    <div className="flex gap-3">
                      <Link href={`/worker/${worker.id}`} className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {worker.profile_photo_url ? (
                            <Image
                              src={worker.profile_photo_url}
                              alt={worker.full_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/worker/${worker.id}`}>
                          <h4 className="font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                            {worker.full_name}
                          </h4>
                        </Link>
                        
                        {service && (
                          <p className="text-sm text-emerald-600 font-semibold capitalize mb-1">
                            {service.category} • R{service.price_min}/{service.pricing_type}
                          </p>
                        )}

                        {worker.average_rating && (
                          <div className="flex items-center gap-1 mb-1">
                            <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-900">{worker.average_rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500">({worker.total_jobs || 0} jobs)</span>
                          </div>
                        )}

                        {interaction.comment && (
                          <p className="text-sm text-gray-600 italic mt-1">"{interaction.comment}"</p>
                        )}

                        <div className="flex gap-2 mt-2">
                          <a
                            href={`https://wa.me/${worker.phone_number?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                          </a>
                          <Link
                            href={`/worker/${worker.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">No workers interested yet</p>
              <p className="text-xs text-gray-500 mt-1">Workers will be notified about your job posting</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}