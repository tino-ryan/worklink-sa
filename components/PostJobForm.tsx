// components/PostJobForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { postJob } from '@/app/actions/client'

interface Props {
categories: readonly {
  value: string
  label: string
  icon?: string
}[]

locations: readonly string[]

}

export default function PostJobForm({ categories, locations }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    date_needed: '',
    time_preference: 'flexible',
    budget_min: '',
    budget_max: ''
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.category) {
      newErrors.category = 'Please select a service type'
    }

    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'Please provide at least 20 characters describing your job'
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location'
    }

    if (!formData.date_needed) {
      newErrors.date_needed = 'Please select when you need the work done'
    } else {
      const selectedDate = new Date(formData.date_needed)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.date_needed = 'Date cannot be in the past'
      }
    }

    if (formData.budget_min && formData.budget_max) {
      const min = parseInt(formData.budget_min)
      const max = parseInt(formData.budget_max)
      
      if (min > max) {
        newErrors.budget_max = 'Maximum budget must be greater than minimum'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value)
    })

    startTransition(async () => {
      const result = await postJob(formDataObj)
      
      if (result.error) {
        setErrors({ submit: result.error })
      } else if (result.success) {
        setShowSuccess(true)
        
        // Redirect after showing success
        setTimeout(() => {
          router.push('/client/jobs')
        }, 2000)
      }
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Posted Successfully! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Workers in your area are being notified. You'll receive messages from interested workers via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/client/jobs')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all active:scale-95"
            >
              View My Jobs
            </button>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              Browse Workers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 space-y-6">
      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-shake">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">{errors.submit}</span>
          </div>
        </div>
      )}

      {/* Service Category */}
      <div data-error={!!errors.category}>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          What service do you need? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
            errors.category ? 'border-red-500' : 'border-gray-200'
          }`}
          disabled={isPending}
        >
          <option value="">Select a service...</option>
          {categories.filter(cat => cat.value !== 'all').map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.category}
          </p>
        )}
      </div>

      {/* Description */}
      <div data-error={!!errors.description}>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Describe what you need done <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={5}
          placeholder="Example: I need my garden cleaned, grass cut, and plants trimmed. The garden is about 50m² and has some overgrown bushes that need attention..."
          className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-200'
          }`}
          disabled={isPending}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.description ? (
            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.description}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Minimum 20 characters</p>
          )}
          <p className={`text-sm font-medium ${formData.description.length < 20 ? 'text-gray-400' : 'text-emerald-600'}`}>
            {formData.description.length}/20
          </p>
        </div>
      </div>

      {/* Location & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Location */}
        <div data-error={!!errors.location}>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Where? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
              errors.location ? 'border-red-500' : 'border-gray-200'
            }`}
            disabled={isPending}
          >
            <option value="">Select location...</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.location}
            </p>
          )}
        </div>

        {/* Date Needed */}
        <div data-error={!!errors.date_needed}>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            When? <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date_needed}
            onChange={(e) => updateField('date_needed', e.target.value)}
            min={minDate}
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
              errors.date_needed ? 'border-red-500' : 'border-gray-200'
            }`}
            disabled={isPending}
          />
          {errors.date_needed && (
            <p className="mt-1 text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.date_needed}
            </p>
          )}
        </div>
      </div>

      {/* Time Preference */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Preferred Time
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: 'morning', label: 'Morning', icon: '🌅' },
            { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
            { value: 'evening', label: 'Evening', icon: '🌆' },
            { value: 'flexible', label: 'Flexible', icon: '⏰' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('time_preference', option.value)}
              className={`px-4 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 ${
                formData.time_preference === option.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isPending}
            >
              <span className="text-xl block mb-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range (Optional) */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Budget Range (Optional)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div data-error={!!errors.budget_min}>
            <input
              type="number"
              value={formData.budget_min}
              onChange={(e) => updateField('budget_min', e.target.value)}
              placeholder="Minimum (R)"
              min="0"
              step="50"
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
                errors.budget_min ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={isPending}
            />
          </div>
          <div data-error={!!errors.budget_max}>
            <input
              type="number"
              value={formData.budget_max}
              onChange={(e) => updateField('budget_max', e.target.value)}
              placeholder="Maximum (R)"
              min="0"
              step="50"
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
                errors.budget_max ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={isPending}
            />
          </div>
        </div>
        {errors.budget_max && (
          <p className="mt-1 text-sm text-red-600 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.budget_max}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-600">
          💡 Setting a budget helps attract the right workers
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting Job...
            </>
          ) : (
            <>
              Post Job
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  )
}