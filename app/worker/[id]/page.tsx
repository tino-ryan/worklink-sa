// app/worker/[id]/page.tsx - Optimized Layout
import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { getWorkerDetails } from '@/app/actions/client'
import ContactButtons from '@/components/ContactButtons'
import WorkerPhotoGallery from '@/components/WorkerPhotoGallery'
import ReviewsList from '@/components/ReviewsList'

export default async function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const user = await getUser()
  const { worker, error } = await getWorkerDetails(id)

  if (error || !worker) {
    notFound()
  }

  if (!user) {
    redirect(`/auth/login?redirect=/worker/${id}`)
  }

  const reviewCount = worker.reviews?.length || 0
  const photoCount = worker.work_photos?.length || 0

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Compact Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link 
              href="/browse" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium text-sm">Back</span>
            </Link>
            <h1 className="text-sm font-semibold text-gray-900">Worker Profile</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Compact Cover */}
          <div className="h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

          <div className="px-4 pb-4">
            {/* Profile Photo */}
            <div className="relative -mt-10 mb-3">
              <div className="relative w-20 h-20 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {worker.profile_photo_url ? (
                  <Image
                    src={worker.profile_photo_url}
                    alt={worker.full_name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Available Badge */}
              {worker.availability?.available_today && (
                <div className="absolute -top-1 left-16 px-2 py-0.5 bg-emerald-600 text-white rounded-md shadow-md flex items-center gap-1 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  Available
                </div>
              )}
            </div>

            {/* Name & Key Stats */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
                {worker.full_name}
              </h1>

              {/* Location */}
              {worker.primary_location && (
                <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">{worker.primary_location}</span>
                </div>
              )}

              {/* Compact Stats Row */}
              <div className="flex items-center gap-4 text-sm">
                {/* Rating */}
                {worker.average_rating ? (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-gray-900">
                      {worker.average_rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({reviewCount})
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">No reviews</span>
                )}

                {/* Jobs */}
                <div className="flex items-center gap-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{worker.total_jobs || 0} jobs</span>
                </div>
              </div>
            </div>

            {/* Contact Buttons - WhatsApp Primary */}
            <div className="flex gap-2">
              {/* WhatsApp - Primary */}
              <a
                href={`https://wa.me/${worker.phone_number?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm">WhatsApp</span>
              </a>

              {/* Call - Secondary */}
              {worker.phone_number && (
                <a
                  href={`tel:${worker.phone_number}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">Call</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {worker.bio && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">About</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {worker.bio}
            </p>
          </div>
        )}

        {/* Services Section */}
        {worker.services && worker.services.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Services</h2>
            </div>

            <div className="space-y-3">
              {worker.services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 bg-gradient-to-br from-gray-50 to-purple-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 capitalize mb-0.5">
                        {service.category}
                      </h3>
                      {service.years_experience && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="font-medium">{service.years_experience} years experience</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        R{service.price_min}
                        {service.price_max && service.price_max !== service.price_min 
                          ? `-R${service.price_max}` 
                          : ''}
                      </div>
                      <div className="text-xs text-gray-500 font-medium capitalize">
                        per {service.pricing_type}
                      </div>
                    </div>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Photos Gallery */}
        {photoCount > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Work Photos</h2>
              <span className="text-sm text-gray-500">({photoCount})</span>
            </div>
            <WorkerPhotoGallery photos={worker.work_photos || []} />
          </div>
        )}

        {/* Reviews Section */}
        {reviewCount > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
              <span className="text-sm text-gray-500">({reviewCount})</span>
            </div>
            <ReviewsList reviews={worker.reviews || []} />
          </div>
        )}

        {/* Sticky Bottom Contact - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg lg:hidden z-40">
          <div className="max-w-5xl mx-auto flex gap-2">
            {/* WhatsApp - Primary */}
            <a
              href={`https://wa.me/${worker.phone_number?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-sm">WhatsApp</span>
            </a>

            {/* Call - Secondary */}
            {worker.phone_number && (
              <a
                href={`tel:${worker.phone_number}`}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">Call</span>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}