// components/WorkerSearchClient.tsx - Optimized with WhatsApp/Call
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { WorkerWithDetails, SearchFilters } from '@/types'

interface Props {
  initialWorkers: WorkerWithDetails[]
  initialFilters: SearchFilters
  initialPage: number
  totalPages: number
  isLoggedIn: boolean

  categories: readonly {
    value: string
    label: string
    icon?: string
  }[]

  locations: readonly string[]
}


// Popular South African regions
const POPULAR_LOCATIONS = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Polokwane',
  'Nelspruit',
  'Kimberley'
]

export default function WorkerSearchClient({
  initialWorkers,
  initialFilters,
  initialPage,
  totalPages,
  isLoggedIn,
  categories,
  locations
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [filters, setFilters] = useState(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationSearch, setLocationSearch] = useState(initialFilters.location || '')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [userLocation, setUserLocation] = useState<string | null>(null)

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation && !initialFilters.location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This would need a reverse geocoding service in production
          // For now, we'll just set a flag that location was detected
          setUserLocation('Location detected')
        },
        () => {
          // Silent fail - location optional
        }
      )
    }
  }, [])

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)

    const params = new URLSearchParams()
    if (updated.category && updated.category !== 'all') params.set('category', updated.category)
    if (updated.location) params.set('location', updated.location)
    if (updated.availableToday !== undefined) params.set('available', String(updated.availableToday))
    
    startTransition(() => {
      router.push(`/browse?${params.toString()}`)
    })
  }

  const filteredLocations = locationSearch
    ? locations.filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase()))
    : POPULAR_LOCATIONS

  // Filter workers by search query
  const filteredWorkers = searchQuery.trim() 
    ? initialWorkers.filter(worker => {
        const query = searchQuery.toLowerCase()
        const name = worker.full_name.toLowerCase()
        const location = worker.primary_location?.toLowerCase() || ''
        const services = worker.services?.map(s => s.category.toLowerCase()).join(' ') || ''
        const bio = worker.bio?.toLowerCase() || ''
        
        return name.includes(query) || 
               location.includes(query) || 
               services.includes(query) ||
               bio.includes(query)
      })
    : initialWorkers

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, service, or location..."
            className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-center">
          {/* Category */}
          <div className="lg:col-span-3">
            <select
              value={filters.category || 'all'}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
              disabled={isPending}
            >
              <option value="all">All Services</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location Search */}
          <div className="lg:col-span-3 relative">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value)
                  setShowLocationDropdown(true)
                }}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                placeholder="Search location..."
                className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isPending}
              />
              {locationSearch && (
                <button
                  onClick={() => {
                    setLocationSearch('')
                    updateFilters({ location: '' })
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocationSearch(loc)
                        updateFilters({ location: loc })
                        setShowLocationDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-emerald-50 transition-colors"
                    >
                      {loc}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No locations found</div>
                )}
              </div>
            )}
          </div>

          {/* Available Today Toggle */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <button
              onClick={() => updateFilters({ availableToday: !filters.availableToday })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                filters.availableToday ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              disabled={isPending}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  filters.availableToday ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">Available today</span>
          </div>

          {/* Clear Button */}
          <div className="lg:col-span-3">
            <button
              onClick={() => {
                setFilters({ category: 'all', location: '', availableToday: false })
                setSearchQuery('')
                setLocationSearch('')
                router.push('/browse')
              }}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              disabled={isPending}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      )}

      {/* Results Count */}
      {searchQuery && (
        <div className="px-1">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{filteredWorkers.length}</span> result{filteredWorkers.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Worker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No workers found</h3>
          <p className="text-sm text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setLocationSearch('')
              setFilters({ category: 'all', location: '', availableToday: false })
              router.push('/browse')
            }}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-2">
          <button
            onClick={() => router.push(`/browse?${searchParams.toString()}&page=${Math.max(1, initialPage - 1)}`)}
            disabled={initialPage === 1 || isPending}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 font-bold text-sm text-gray-900 bg-gray-100 rounded-lg">
            {initialPage} / {totalPages}
          </span>
          <button
            onClick={() => router.push(`/browse?${searchParams.toString()}&page=${Math.min(totalPages, initialPage + 1)}`)}
            disabled={initialPage === totalPages || isPending}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

function WorkerCard({ worker, isLoggedIn }: { worker: WorkerWithDetails; isLoggedIn: boolean }) {
  const service = worker.services?.[0]
  const [showActions, setShowActions] = useState(false)
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition-all group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Photo */}
      <Link href={`/worker/${worker.id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {worker.profile_photo_url ? (
            <Image
              src={worker.profile_photo_url}
              alt={worker.full_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {worker.availability?.available_today && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              Now
            </div>
          )}

          {worker.work_photos && worker.work_photos.length > 0 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white rounded flex items-center gap-1 text-xs font-semibold backdrop-blur-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {worker.work_photos.length}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <Link href={`/worker/${worker.id}`}>
          <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {worker.full_name}
          </h3>
          {service && (
            <p className="text-xs text-emerald-600 font-semibold capitalize line-clamp-1">
              {service.category}
            </p>
          )}
        </Link>

        {worker.average_rating ? (
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-gray-900">
              {worker.average_rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({worker.reviews?.length || 0})
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">New</span>
        )}

        {service && (
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-bold text-gray-900">
              R{service.price_min}
            </span>
            {service.price_max && service.price_max !== service.price_min && (
              <span className="text-sm font-bold text-gray-900">-{service.price_max}</span>
            )}
            <span className="text-xs text-gray-500">/{service.pricing_type}</span>
          </div>
        )}

        {worker.primary_location && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{worker.primary_location}</span>
          </div>
        )}

        {/* WhatsApp & Call Buttons */}
        {isLoggedIn && worker.phone_number && (
          <div className="flex gap-1.5 pt-1">
            <a
              href={`https://wa.me/${worker.phone_number.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs font-semibold">WhatsApp</span>
            </a>

            <a
              href={`tel:${worker.phone_number}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-md transition-colors border border-gray-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        )}

        {/* View Profile Link for non-logged in users */}
        {!isLoggedIn && (
          <Link
            href={`/worker/${worker.id}`}
            className="block w-full px-2 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700 transition-all text-center"
          >
            View Profile
          </Link>
        )}
      </div>
    </div>
  )
}