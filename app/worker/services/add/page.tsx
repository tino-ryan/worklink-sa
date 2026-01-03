// app/worker/services/add/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addService } from '@/app/actions/worker'
import InfoTooltip from '@/components/InfoTooltip'
import { SERVICE_CATEGORIES } from '@/lib/constants'

export default function AddServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [customService, setCustomService] = useState('')
  
  const [formData, setFormData] = useState({
    category: '',
    pricing_type: 'hourly' as 'hourly' | 'fixed' | 'daily',
    price_min: '',
    price_max: '',
    description: '',
  })

  const filteredServices = SERVICE_CATEGORIES.filter(service =>
    service.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.category) {
      setError('Please select or enter a service')
      setLoading(false)
      return
    }

    if (!formData.price_min) {
      setError('Please enter a price')
      setLoading(false)
      return
    }

    const result = await addService({
      category: formData.category,
      pricing_type: formData.pricing_type,
      price_min: parseInt(formData.price_min),
      price_max: formData.price_max ? parseInt(formData.price_max) : undefined,
      description: formData.description,
    })
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/worker/services')
    }
  }

  const selectService = (serviceName: string) => {
    setFormData(prev => ({ ...prev, category: serviceName }))
    setSearchTerm('')
    setCustomService('')
  }

  const addCustomService = () => {
    if (customService.trim()) {
      setFormData(prev => ({ ...prev, category: customService.trim() }))
      setCustomService('')
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
            <h1 className="text-lg font-bold text-gray-900">Add Service</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Services */}
          {!formData.category && (
            <>
              <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-base font-bold text-gray-900">
                    Search Services
                  </label>
                  <InfoTooltip 
                    content={{
                      en: "Type to search for services, or add your own below",
                      zu: "Thayipha ukusesha izinsizakalo, noma wengeze eyakho ngezansi",
                      st: "Tlanya ho batla lits'ebeletso, kapa o kenye tsa hau ka tlase"
                    }}
                  />
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type to search (e.g., plumber, garden)..."
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                {searchTerm && filteredServices.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {filteredServices.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => selectService(service.label)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 text-left transition-all active:scale-95"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-semibold text-gray-900">{service.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Service */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-base font-bold text-gray-900">
                    Or Add Your Own Service
                  </label>
                  <InfoTooltip 
                    content={{
                      en: "Can't find your service? Add it here",
                      zu: "Awukutholi isinsizakalo sakho? Sengeza lapha",
                      st: "Ha u fumane ts'ebeletso ea hau? E kenye mona"
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="Type your service name..."
                    className="flex-1 px-4 py-3.5 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 text-base text-gray-900 placeholder:text-gray-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={addCustomService}
                    disabled={!customService.trim()}
                    className="px-6 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Selected Service */}
          {formData.category && (
            <>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 font-medium">Selected Service</p>
                      <h3 className="text-lg font-bold text-gray-900 capitalize">{formData.category}</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: '' }))}
                    className="px-4 py-2 bg-white border-2 border-emerald-300 text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 active:scale-95 transition-all"
                  >
                    Change
                  </button>
                </div>
              </div>

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
            </>
          )}
        </form>
      </main>

      {/* Fixed Bottom Button */}
      {formData.category && (
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
                  Adding...
                </div>
              ) : (
                'Add Service'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}