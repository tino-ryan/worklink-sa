// app/worker/profile/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function WorkerProfileViewPage() {
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

  // Get availability
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('worker_id', profile.id)
    .single()

  // Get work photos
  const { data: workPhotos } = await supabase
    .from('work_photos')
    .select('*')
    .eq('worker_id', profile.id)
    .order('uploaded_at', { ascending: false })

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      client:client_id (
        full_name,
        profile_photo_url
      )
    `)
    .eq('worker_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const selectedDays = availability?.weekly_schedule
    ? Object.entries(availability.weekly_schedule)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/worker/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold hidden sm:inline">Dashboard</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
            <Link
              href="/worker/profile/edit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              Edit
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 -mt-12">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white">
                  {profile.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
                      <span className="text-4xl text-white font-bold">
                        {profile.full_name?.charAt(0) || 'W'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 mt-4 sm:mt-12">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {profile.full_name || 'No name set'}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {/* Location */}
                  {profile.primary_location && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-900">{profile.primary_location}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-amber-900">
                      {(profile.average_rating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-amber-700">({reviews?.length || 0})</span>
                  </div>

                  {/* Jobs Completed */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold text-emerald-900">{profile.total_jobs || 0}</span>
                    <span className="text-xs text-emerald-700">jobs</span>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio ? (
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Services & Pricing</h2>
            </div>
            <Link
              href="/worker/services"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              Manage
            </Link>
          </div>
          
          {services && services.length > 0 ? (
            <div className="grid gap-3">
              {services.map((service) => (
                <div key={service.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 capitalize text-lg mb-1">{service.category}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-emerald-600">
                        R{service.price_min}
                        {service.price_max && service.price_max !== service.price_min && `-${service.price_max}`}
                      </p>
                      <p className="text-xs text-gray-500 capitalize font-medium">per {service.pricing_type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-4">No services added yet</p>
              <Link
                href="/worker/onboarding"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-md"
              >
                Add Your First Service
              </Link>
            </div>
          )}
        </div>

        {/* Availability Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Availability</h2>
            </div>
            <Link
              href="/worker/availability"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-4">
            {/* Today's Status */}
            <div className={`p-4 rounded-xl border-2 ${
              availability?.available_today 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  availability?.available_today ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full ${
                    availability?.available_today ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    {availability?.available_today ? 'Available Today' : 'Not Available Today'}
                  </p>
                  <p className="text-sm text-gray-600">Current status</p>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            {selectedDays.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Usually Available:</p>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <span
                      key={day}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        selectedDays.includes(day)
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {day.substring(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Photos Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Work Gallery</h2>
            </div>
            <Link
              href="/worker/photos"
              className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              Manage
            </Link>
          </div>
          
          {workPhotos && workPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {workPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || 'Work photo'}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm font-medium">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-4">No work photos yet</p>
              <Link
                href="/worker/photos"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 active:scale-95 transition-all shadow-md"
              >
                Upload Photos
              </Link>
            </div>
          )}
        </div>

        {/* Reviews Card */}
        {reviews && reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
            </div>
            
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl border-2 border-amber-100">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">
                        {review.client?.full_name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed pl-13">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}