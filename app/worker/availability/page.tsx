// app/worker/availability/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkerNavigation from '@/components/WorkerNavigation'
import AvailabilityToggle from '@/components/AvailabilityToggle'
import WeeklyScheduleForm from '@/components/WeeklyScheduleForm'

export default async function WorkerAvailabilityPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  if (profile?.user_type !== 'worker') {
    redirect('/browse')
  }

  const supabase = await createServerSupabaseClient()

  // Get availability
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('worker_id', profile.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
              <span className="font-semibold hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Availability</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Today's Status Card */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Available Today</h2>
              <p className="text-sm text-gray-600">Toggle your availability for today</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100">
            <AvailabilityToggle 
              workerId={profile.id}
              initialStatus={availability?.available_today || false}
            />
          </div>

          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800 leading-relaxed">
                When you're available, clients in your area can see your profile in search results. Turn it off when you're busy or not working.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Card */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Weekly Schedule</h2>
              <p className="text-sm text-gray-600">Which days are you usually available?</p>
            </div>
          </div>

          <WeeklyScheduleForm 
            workerId={profile.id}
            initialSchedule={availability?.weekly_schedule || {
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false,
              sunday: false
            }}
          />
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 mb-2">
                Pro Tips for Better Visibility
              </h3>
              <ul className="text-sm text-amber-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>Workers who toggle "Available Today" get 3x more job requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>Update your status every morning for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>Your weekly schedule helps clients plan ahead</span>
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