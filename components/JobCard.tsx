// components/JobCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { expressInterest, saveJobForLater } from '@/app/actions/worker'

export default function JobCard({ 
  job, 
  workerId, 
  isSaved 
}: { 
  job: any
  workerId: string
  isSaved: boolean 
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(isSaved)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const client = job.profiles
  const dateNeeded = new Date(job.date_needed).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const handleSave = async () => {
    const result = await saveJobForLater(job.id)
    if (result.success) {
      setSaved(result.saved || false)
      router.refresh()
    }
  }

  const handleExpressInterest = async () => {
    setLoading(true)
    const result = await expressInterest(job.id, comment)
    
    if (result.error) {
      alert(result.error)
    } else {
      setShowInterestModal(false)
      alert('Interest sent! The client will see your message.')
    }
    setLoading(false)
  }

  const handleWhatsApp = () => {
    const phone = client.phone_number?.replace(/[^0-9]/g, '')
    const message = encodeURIComponent(`Hi! I'm interested in your ${job.category} job posted on WorkLink.`)
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:border-emerald-500 transition-colors">
        <div className="p-4 space-y-3">
          {/* Client Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {client.profile_photo_url ? (
                <Image
                  src={client.profile_photo_url}
                  alt={client.full_name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">{client.full_name}</h3>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                saved 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 capitalize mb-1">{job.category}</h4>
            <p className="text-gray-700 leading-relaxed text-sm">{job.description}</p>
          </div>

          {/* Job Info */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{dateNeeded}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium capitalize">{job.time_preference}</span>
            </div>
          </div>

          {job.budget_min && job.budget_max && (
            <div className="flex items-center gap-2 py-2 px-3 bg-emerald-50 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-emerald-700 text-sm">
                Budget: R{job.budget_min} - R{job.budget_max}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => setShowInterestModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="hidden sm:inline">Interested</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowInterestModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Express Interest</h3>
              <button
                onClick={() => setShowInterestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              Add a message to let {client.full_name} know why you're the right person for this job.
            </p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Example: Hi! I have 5 years of experience and I'm available on the date you need..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleExpressInterest}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                {loading ? 'Sending...' : 'Send Interest'}
              </button>
              <button
                onClick={() => setShowInterestModal(false)}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}