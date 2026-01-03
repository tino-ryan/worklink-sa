// app/worker/services/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkerNavigation from '@/components/WorkerNavigation'
import DeleteServiceButton from '@/components/DeleteServiceButton'

export default async function WorkerServicesPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const supabase = await createServerSupabaseClient()

  // Get worker services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('worker_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-10 shadow-md">
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
            <h1 className="text-lg font-bold text-gray-900">My Services</h1>
            <Link
              href="/worker/services/add"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              + Add
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {services && services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                {/* Service Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b-2 border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize text-lg">
                          {service.category}
                        </h3>
                        <p className="text-xs text-gray-600 capitalize font-medium">
                          {service.pricing_type} rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        R{service.price_min}
                        {service.price_max && service.price_max !== service.price_min && `-${service.price_max}`}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        per {service.pricing_type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-5">
                  {service.description ? (
                    <p className="text-gray-700 leading-relaxed mb-4">{service.description}</p>
                  ) : (
                    <p className="text-gray-500 italic mb-4">No description added</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/worker/services/${service.id}/edit`}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-center shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <DeleteServiceButton serviceId={service.id} serviceName={service.category} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6">Add your services to start getting clients</p>
            <Link
              href="/worker/services/add"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl active:scale-95 transition-all shadow-lg"
            >
              Add Your First Service
            </Link>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-900 mb-1">
                Service Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Add detailed descriptions to attract more clients</li>
                <li>• Keep your rates competitive and fair</li>
                <li>• You can't add duplicate services</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <WorkerNavigation />
    </div>
  )
}