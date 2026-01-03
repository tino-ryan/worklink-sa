// app/client/dashboard/page.tsx - Optimized Dashboard
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/app/actions/auth'
import { searchWorkers } from '@/app/actions/client'
import { CATEGORIES } from '@/types'
import ServiceCategoriesModal from '@/components/ServiceCategoriesModal'
import DashboardWorkerCard from '@/components/DashboardWorkerCard'

export default async function ClientDashboard() {
  const user = await getUser()
  const profile = await getProfile()

  if (!user) redirect('/auth/login')
  if (profile?.user_type !== 'client') redirect('/browse')

  const { workers } = await searchWorkers({ 
    category: 'all', 
    availableToday: true 
  }, 1, 8)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* Quick Actions Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Link
              href="/browse"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">Browse Workers</span>
            </Link>

            <Link
              href="/client/post-job"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">Post Job</span>
            </Link>

            <Link
              href="/client/saved"
              className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2.5 px-4 rounded-lg font-semibold transition-colors border border-amber-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-sm hidden sm:inline">Saved</span>
            </Link>
          </div>
        </div>

        {/* Services Card with Modal */}
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-lg border border-emerald-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Find Services</h2>
            </div>
            <ServiceCategoriesModal />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {CATEGORIES.slice(0, 12).map((cat) => (
              <Link
                key={cat.value}
                href={`/browse?category=${cat.value}`}
                className="bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg p-2 transition-all group"
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mx-auto">{getCategoryIcon(cat.value)}</div>
                  <div className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700 line-clamp-2 leading-tight">
                    {cat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 text-white shadow-sm">
            <div className="text-2xl font-bold">{workers.length}+</div>
            <div className="text-xs opacity-90">Available Now</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 text-white shadow-sm">
            <div className="text-2xl font-bold">5k+</div>
            <div className="text-xs opacity-90">Verified Workers</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-3 text-white shadow-sm">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-xs opacity-90">Support</div>
          </div>
        </div>

        {/* Available Today Workers */}
        {workers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="text-base font-bold text-gray-900">Available Right Now</h2>
              </div>
              <Link
                href="/browse?available=true"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {workers.map((worker) => (
                <DashboardWorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity / Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-900 mb-1">Quick Tip</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Contact workers directly via WhatsApp for faster responses. Most workers reply within minutes! 🚀
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    gardening: '🌿',
    cleaning: '🧹',
    plumbing: '🔧',
    electrical: '⚡',
    painting: '🎨',
    construction: '🏗️',
    moving: '📦',
    childcare: '👶',
    driving: '🚗',
    cooking: '👨‍🍳',
    handyman: '🔨',
    security: '🛡️',
    laundry: '🧺',
    tutoring: '📚',
    beauty: '💇',
    fitness: '💪',
    photography: '📸',
    catering: '🍽️',
    tailoring: '🧵',
    mechanic: '🔩'
  }
  return icons[category] || '💼'
}