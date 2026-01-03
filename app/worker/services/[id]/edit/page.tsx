// app/worker/services/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { updateService } from '@/app/actions/worker'
import InfoTooltip from '@/components/InfoTooltip'

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    pricing_type: 'hourly' as 'hourly' | 'fixed' | 'daily',
    price_min: '',
    price_max: '',
    description: '',
  })

  // TODO: Load service data
  useEffect(() => {
    // Fetch service data and populate form
  }, [serviceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.price_min) {
      setError('Please enter a price')
      setLoading(false)
      return
    }

    const result = await updateService(serviceId, {
      pricing_type: formData.pricing_type,
      price_min: parseInt(formData.price_min),
      price_max: formData.price_max ? parseInt(formData.price_max) : undefined,
      description: formData.description,
    })
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/worker/services')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">
            <Link 
              href="/worker/services" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Edit Service</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pricing Type */}
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-base font-bold text-gray-900">
                How do you charge?
              </label>
              <InfoTooltip 
                content={{
                  en: "Choose hourly for time-based work, or fixed for complete jobs",
                  zu: "Khetha ngehora ukusebenza ngokwesikhathi, noma okuqinile ukuqedela imisebenzi",
                  st: "Khetha ka hora bakeng sa mosebetsi o thehiloeng nakong, kapa o tsitsitseng bakeng sa mesebetsi e phethahetseng"
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, pricing_type: 'hourly' }))}
                className={`py-4 px-4 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                  formData.pricing_type === 'hourly'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Per Hour
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, pricing_type: 'fixed' }))}
                className={`py-4 px-4 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                  formData.pricing_type === 'fixed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Fixed Price
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-base font-bold text-gray-900">
                Your Rate
              </label>
              <InfoTooltip 
                content={{
                  en: "Set your rate. Be competitive but fair to your skills",
                  zu: "Setha inani lakho. Yiba nokuncintisana kodwa ube nobulungisa kwamakhono akho",
                  st: "Beha theko ea hau. E-ba le tlhodisano empa u loke ho tsebo ea hau"
                }}
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-900 font-bold text-xl">R</span>
              <input
                type="number"
                value={formData.price_min}
                onChange={(e) => setFormData(prev => ({ ...prev, price_min: e.target.value }))}
                placeholder="150"
                className="w-full pl-10 pr-20 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-xl font-bold text-gray-900 placeholder:text-gray-400"
              />
              <span className="absolute right-4 top-4 text-gray-600 text-sm font-medium">
                /{formData.pricing_type === 'hourly' ? 'hour' : 'job'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-base font-bold text-gray-900">
                Describe Your Service
              </label>
              <InfoTooltip 
                content={{
                  en: "Tell clients what you can do. Be specific about your skills",
                  zu: "Tshela amaklayenti ukuthi ungenzani. Chaza ngamakhono akho",
                  st: "Bolella bareki seo u ka se etsang. E-ba hantle ka botsebetso ba hau"
                }}
              />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Example: I can fix taps, install toilets, repair pipes. I have my own tools and 5 years experience."
              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 placeholder:text-gray-500 leading-relaxed resize-none"
              rows={4}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-800">Service updated successfully!</p>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-100 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Link
            href="/worker/services"
            className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}