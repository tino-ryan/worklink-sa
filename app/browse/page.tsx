// app/browse/page.tsx - Optimized
import Link from 'next/link'
import { Suspense } from 'react'
import { getUser } from '@/app/actions/auth'
import { searchWorkers } from '@/app/actions/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkerSearchClient from '@/components/WorkerSearchClient'
import ClientNav from '@/components/ClientNav'
import type { SearchFilters } from '@/types'
import { CATEGORIES, SA_LOCATIONS } from '@/types'

interface SearchParams {
  category?: string
  location?: string
  available?: string
  page?: string
}

export default async function BrowseWorkersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const user = await getUser()
  const supabase = await createServerSupabaseClient()
  
  const profile = user ? await supabase
    .from('profiles')
    .select('full_name, user_type')
    .eq('user_id', user.id)
    .single() : null

  const filters: SearchFilters = {
    category: params.category || 'all',
    location: params.location,
    availableToday: params.available !== 'false',
  }

  const currentPage = parseInt(params.page || '1')
  const { workers, total, totalPages } = await searchWorkers(filters, currentPage)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {user && profile?.data ? (
        <ClientNav profile={profile.data} />
      ) : (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-14">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  WorkLink
                </span>
              </Link>
              
              <div className="flex items-center gap-2">
                <Link 
                  href="/auth/login"
                  className="px-3 py-1.5 text-gray-700 hover:text-emerald-600 font-semibold transition-colors text-sm"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 py-4">
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              <Link href="/auth/signup" className="font-bold hover:underline">Sign up free</Link> to contact workers directly via WhatsApp or phone 🚀
            </p>
          </div>
        )}

        {user && profile?.data?.user_type === 'client' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <p className="text-sm font-bold text-emerald-900">Need help for later?</p>
                <p className="text-xs text-emerald-700">Post a job and let workers come to you</p>
              </div>
            </div>
            <Link
              href="/client/post-job"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-all text-sm whitespace-nowrap"
            >
              Post Job
            </Link>
          </div>
        )}

        <Suspense fallback={<SearchSkeleton />}>
          <WorkerSearchClient
            initialWorkers={workers}
            initialFilters={filters}
            initialPage={currentPage}
            totalPages={totalPages}
            isLoggedIn={!!user}
            categories={CATEGORIES}
            locations={SA_LOCATIONS}
          />
        </Suspense>

        {workers.length === 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No workers found</h3>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your search filters</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/browse"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors text-sm"
              >
                Clear Filters
              </Link>
              {user && (
                <Link
                  href="/client/post-job"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-all text-sm"
                >
                  Post a Job
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg mb-3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}