// components/DashboardWorkerCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function DashboardWorkerCard({ worker }: { worker: any }) {
  const service = worker.services?.[0]
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition-all group">
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

          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            Now
          </div>

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
        {worker.phone_number && (
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
      </div>
    </div>
  )
}