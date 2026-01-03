// components/ReviewsList.tsx
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  comment?: string | null
  created_at: string
  client?: {
    full_name: string
    profile_photo_url: string | null
  }
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl"
        >
          <div className="flex items-start gap-3 mb-3">
            {/* Client Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
              {review.client?.profile_photo_url ? (
                <Image
                  src={review.client.profile_photo_url}
                  alt={review.client.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
                  {review.client?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Review Header */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-bold text-gray-900">
                  {review.client?.full_name || 'Anonymous'}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('en-ZA', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-amber-500 fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm font-bold text-gray-700 ml-1">
                  {review.rating}.0
                </span>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}