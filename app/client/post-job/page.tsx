// app/client/post-job/page.tsx
import PostJobForm from '@/components/PostJobForm'
import { CATEGORIES, SA_LOCATIONS } from '@/types'

export default function PostJobPage() {
  return (
    <div className="pb-20 md:pb-6">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Post a Job
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Let workers know what you need. They'll contact you directly via WhatsApp.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How It Works
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <p className="text-blue-900 font-medium">
                Fill in the details about your job below
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <p className="text-blue-900 font-medium">
                Workers in your area will get notified via WhatsApp or SMS
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <p className="text-blue-900 font-medium">
                Interested workers will message you directly to discuss details
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <PostJobForm
          categories={CATEGORIES}
          locations={SA_LOCATIONS}
        />

        {/* Tips */}
        <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips for Better Results
          </h3>
          <ul className="space-y-2 text-amber-900">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span className="font-medium">Be specific about what you need done</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span className="font-medium">Include your location and date needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span className="font-medium">Set a realistic budget range to attract quality workers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span className="font-medium">Respond quickly when workers contact you</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}