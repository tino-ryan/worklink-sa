'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/app/actions/worker'

type Service = {
  name: string
  rate: string
  rateType: 'hourly' | 'fixed'
  experience: string
  description: string
}

type OnboardingStep = 'services' | 'availability' | 'complete'

export default function WorkerOnboardingClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('services')
  
  const [formData, setFormData] = useState({
    services: [] as Service[],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    primaryLocation: '',
    bio: '',
  })

  const steps: OnboardingStep[] = ['services', 'availability', 'complete']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      // Pass the data object directly to the server action
      const result = await completeOnboarding(formData)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Success! Redirect to dashboard
      router.push('/worker/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const addService = (serviceName: string) => {
    if (!formData.services.find(s => s.name === serviceName)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, {
          name: serviceName,
          rate: '',
          rateType: 'hourly',
          experience: '',
          description: ''
        }]
      }))
    }
  }

  const removeService = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.name !== serviceName)
    }))
  }

  const updateService = (serviceName: string, field: keyof Service, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => 
        s.name === serviceName ? { ...s, [field]: value } : s
      )
    }))
  }

  const POPULAR_SERVICES = [
    { name: 'Gardening', icon: '🌱' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Painting', icon: '🎨' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Carpentry', icon: '🪚' },
  ]

  const LOCATIONS = [
    'Soweto', 'Alexandra', 'Johannesburg CBD', 'Sandton', 'Randburg',
    'Roodepoort', 'Benoni', 'Boksburg', 'Germiston', 'Pretoria',
    'Centurion', 'Midrand', 'Kempton Park'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">Setup Profile</h1>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
              Step {currentStepIndex + 1}/{steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {currentStep === 'services' && (
            <ServicesStep 
              services={formData.services}
              addService={addService}
              removeService={removeService}
              updateService={updateService}
              popularServices={POPULAR_SERVICES}
            />
          )}
          
          {currentStep === 'availability' && (
            <AvailabilityStep 
              formData={formData}
              setFormData={setFormData}
              locations={LOCATIONS}
            />
          )}
          
          {currentStep === 'complete' && (
            <ReviewStep formData={formData} />
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0 || loading}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={currentStep === 'complete' ? handleComplete : nextStep}
            disabled={
              loading ||
              (currentStep === 'services' && formData.services.length === 0) ||
              (currentStep === 'availability' && !formData.primaryLocation)
            }
            className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
          >
            {loading ? 'Saving...' : currentStep === 'complete' ? '✓ Complete' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Services Step
function ServicesStep({ services, addService, removeService, updateService, popularServices }: any) {
  const [customService, setCustomService] = useState('')

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What work do you do?</h2>
        <p className="text-sm text-gray-600">Select services and set your rates</p>
      </div>

      {/* Popular Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3">Popular Services</h3>
        <div className="grid grid-cols-2 gap-2">
          {popularServices.map((service: any) => (
            <button
              key={service.name}
              onClick={() => addService(service.name)}
              disabled={services.some((s: Service) => s.name === service.name)}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 border border-gray-200 disabled:opacity-50"
            >
              <span className="text-2xl">{service.icon}</span>
              <span className="font-semibold text-sm">{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Service */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-2">Add Your Own</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            placeholder="Enter service name..."
            className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
          />
          <button
            onClick={() => {
              if (customService.trim()) {
                addService(customService.trim())
                setCustomService('')
              }
            }}
            className="px-4 bg-blue-600 text-white rounded-lg font-bold"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Services */}
      {services.map((service: Service) => (
        <div key={service.name} className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
          <div className="bg-emerald-50 px-4 py-3 flex justify-between items-center">
            <h4 className="font-bold">{service.name}</h4>
            <button onClick={() => removeService(service.name)} className="text-red-600 font-bold">
              Remove
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Rate Type */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateService(service.name, 'rateType', 'hourly')}
                className={`py-2 rounded-lg border-2 font-bold ${
                  service.rateType === 'hourly' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'
                }`}
              >
                Per Hour
              </button>
              <button
                onClick={() => updateService(service.name, 'rateType', 'fixed')}
                className={`py-2 rounded-lg border-2 font-bold ${
                  service.rateType === 'fixed' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'
                }`}
              >
                Fixed Price
              </button>
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-bold mb-1">Your Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold">R</span>
                <input
                  type="number"
                  value={service.rate}
                  onChange={(e) => updateService(service.name, 'rate', e.target.value)}
                  placeholder="150"
                  className="w-full pl-8 pr-16 py-2 border-2 border-gray-300 rounded-lg"
                />
                <span className="absolute right-3 top-2.5 text-sm text-gray-600">
                  /{service.rateType === 'hourly' ? 'hour' : 'job'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea
                value={service.description}
                onChange={(e) => updateService(service.name, 'description', e.target.value)}
                placeholder="What can you do?"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

// Availability Step
function AvailabilityStep({ formData, setFormData, locations }: any) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">When can you work?</h2>
        <p className="text-sm text-gray-600">Set your location and available days</p>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block font-bold mb-2">Where do you work?</label>
        <select
          value={formData.primaryLocation}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, primaryLocation: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        >
          <option value="">Choose your area...</option>
          {locations.map((loc: string) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Days */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block font-bold mb-3">Which days are you free?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setFormData((prev: any) => ({
                ...prev,
                availability: { ...prev.availability, [day]: !prev.availability[day] }
              }))}
              className={`py-3 rounded-lg border-2 font-bold ${
                formData.availability[day] ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'
              }`}
            >
              {dayLabels[day]}
            </button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block font-bold mb-2">Tell clients about yourself</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
          placeholder="I am hardworking and reliable..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          rows={4}
        />
      </div>
    </>
  )
}

// Review Step
function ReviewStep({ formData }: any) {
  const selectedDays = Object.entries(formData.availability)
    .filter(([_, isSelected]) => isSelected)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
        <p className="text-sm text-gray-600">Check everything before completing</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold mb-3">Services ({formData.services.length})</h3>
        {formData.services.map((service: Service) => (
          <div key={service.name} className="p-3 bg-emerald-50 rounded-lg mb-2">
            <div className="font-bold">{service.name}</div>
            <div className="text-sm">R{service.rate}/{service.rateType}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold mb-2">Location & Days</h3>
        <p className="text-sm mb-2"><strong>Area:</strong> {formData.primaryLocation}</p>
        <div className="flex flex-wrap gap-1">
          {selectedDays.map(day => (
            <span key={day} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
              {day}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-center">
        <h3 className="font-bold text-lg mb-1">Ready to Go!</h3>
        <p className="text-sm">Tap Complete to activate your profile</p>
      </div>
    </>
  )
}