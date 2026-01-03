// app/worker/onboarding/page.tsx - IMPROVED VERSION
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/app/actions/worker'
import InfoTooltip from '@/components/InfoTooltip'
import { Search, MapPin, X, Plus, Check } from 'lucide-react'

type Service = {
  name: string
  rate: string
  rateType: 'hourly' | 'fixed'
  experience: string
  description: string
}

type OnboardingStep = 'services' | 'availability' | 'complete'

export default function WorkerOnboardingPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('services')
  
  const [formData, setFormData] = useState({
    services: [] as Service[],
    availability: {
      monday: false, tuesday: false, wednesday: false, thursday: false,
      friday: false, saturday: false, sunday: false,
    },
    primaryLocation: '',
    locationCoords: null as { lat: number; lng: number } | null,
    bio: '',
  })

  const steps: OnboardingStep[] = ['services', 'availability', 'complete']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const canContinue = 
    (currentStep === 'services' && formData.services.length > 0) ||
    (currentStep === 'availability' && formData.primaryLocation) ||
    currentStep === 'complete'

  const nextStep = () => {
    if (!canContinue || isPending) return
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (isPending) return
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = () => {
    setError(null)
    
    startTransition(async () => {
      try {
        const result = await completeOnboarding({
          services: formData.services,
          availability: formData.availability,
          primaryLocation: formData.primaryLocation,
          bio: formData.bio
        })

        if (result.error) {
          setError(result.error)
          return
        }

        router.push('/worker/dashboard')
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      }
    })
  }

  const POPULAR_SERVICES = [
    { name: 'Gardening', icon: '🌱' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Painting', icon: '🎨' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Carpentry', icon: '🪚' },
    { name: 'Moving', icon: '📦' },
    { name: 'Handyman', icon: '🔨' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Setup Your Profile</h1>
            <span className="text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-full shadow-md">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {currentStep === 'services' && (
            <ServicesStep formData={formData} setFormData={setFormData} popularServices={POPULAR_SERVICES} />
          )}
          {currentStep === 'availability' && (
            <AvailabilityStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 'complete' && (
            <ReviewStep formData={formData} />
          )}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-4 shadow-2xl z-20">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0 || isPending}
            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all text-base shadow-sm"
          >
            ← Back
          </button>
          <button
            onClick={currentStep === 'complete' ? handleComplete : nextStep}
            disabled={!canContinue || isPending}
            className={`flex-1 py-4 rounded-xl font-bold transition-all text-base shadow-lg ${
              canContinue && !isPending
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : currentStep === 'complete' ? (
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Complete Setup
              </div>
            ) : (
              'Continue →'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ServicesStep({ formData, setFormData, popularServices }: any) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customService, setCustomService] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const addService = (serviceName: string) => {
    if (!formData.services.find((s: Service) => s.name === serviceName)) {
      setFormData((prev: any) => ({
        ...prev,
        services: [...prev.services, { 
          name: serviceName, 
          rate: '', 
          rateType: 'hourly', 
          experience: '', 
          description: '' 
        }]
      }))
      setSearchTerm('')
      setCustomService('')
    }
  }

  const removeService = (serviceName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      services: prev.services.filter((s: Service) => s.name !== serviceName)
    }))
  }

  const updateService = (serviceName: string, field: keyof Service, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      services: prev.services.map((s: Service) => 
        s.name === serviceName ? { ...s, [field]: value } : s
      )
    }))
  }

  const filteredServices = popularServices.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {/* Header Card */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl">💼</span>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-2">What Services Do You Offer?</h2>
            <p className="text-emerald-50 font-medium">Select from popular services or add your own</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <label className="block text-base font-bold text-gray-900 mb-3">
          Search for Services
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowSearch(true) }}
            onFocus={() => setShowSearch(true)}
            placeholder="Type to search (e.g., plumber, gardener)..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-base text-gray-900 font-medium placeholder:text-gray-400"
          />
        </div>

        {showSearch && searchTerm && (
          <div className="mt-4">
            {filteredServices.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredServices.map((service: any) => {
                  const isSelected = formData.services.some((s: Service) => s.name === service.name)
                  return (
                    <button
                      key={service.name}
                      onClick={() => addService(service.name)}
                      disabled={isSelected}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-3xl">{service.icon}</span>
                      <span className="font-bold text-gray-900 text-base">{service.name}</span>
                      {isSelected && (
                        <div className="ml-auto flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <Check className="w-5 h-5" />
                          Added
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <p className="text-gray-700 font-semibold mb-3">No matching services found</p>
                <button 
                  onClick={() => { setCustomService(searchTerm); setShowSearch(false) }} 
                  className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 active:scale-95 transition-all shadow-md"
                >
                  Add "{searchTerm}" as custom service
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Services Grid */}
      {!searchTerm && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            Popular Services
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {popularServices.map((service: any) => {
              const isSelected = formData.services.some((s: Service) => s.name === service.name)
              return (
                <button
                  key={service.name}
                  onClick={() => addService(service.name)}
                  disabled={isSelected}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 active:scale-95 transition-all ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{service.icon}</span>
                  <span className="font-bold text-gray-900 text-sm">{service.name}</span>
                  {isSelected && <Check className="w-5 h-5 text-emerald-600 ml-auto" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Custom Service */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          Add Your Own Service
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            placeholder="Enter service name..."
            className="flex-1 px-4 py-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-base text-gray-900 font-medium"
          />
          <button
            onClick={() => { if (customService.trim()) { addService(customService.trim()); setCustomService('') }}}
            disabled={!customService.trim()}
            className="px-8 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all shadow-md text-base"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Services - Detail Forms */}
      {formData.services.map((service: Service) => (
        <div key={service.name} className="bg-white rounded-2xl border-2 border-emerald-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex justify-between items-center">
            <h4 className="font-bold text-white text-lg">{service.name}</h4>
            <button 
              onClick={() => removeService(service.name)} 
              className="text-white hover:bg-white/20 p-2 rounded-lg active:scale-90 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-5 bg-gradient-to-br from-white to-gray-50">
            {/* Pricing Type */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                How do you charge?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateService(service.name, 'rateType', 'hourly')}
                  className={`py-4 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                    service.rateType === 'hourly'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  ⏰ Per Hour
                </button>
                <button
                  type="button"
                  onClick={() => updateService(service.name, 'rateType', 'fixed')}
                  className={`py-4 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                    service.rateType === 'fixed'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  💰 Fixed Price
                </button>
              </div>
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Your Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 font-bold text-gray-900 text-lg">R</span>
                <input
                  type="number"
                  value={service.rate}
                  onChange={(e) => updateService(service.name, 'rate', e.target.value)}
                  placeholder="150"
                  className="w-full pl-10 pr-24 py-4 border-2 border-gray-300 rounded-xl font-bold text-lg text-gray-900 focus:border-emerald-500 focus:outline-none placeholder:text-gray-400"
                />
                <span className="absolute right-4 top-4 text-gray-600 text-sm font-semibold bg-gray-100 px-3 py-1 rounded-lg">
                  /{service.rateType === 'hourly' ? 'hour' : 'job'}
                </span>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Years of Experience
              </label>
              <select
                value={service.experience}
                onChange={(e) => updateService(service.name, 'experience', e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-base text-gray-900 font-semibold bg-white"
              >
                <option value="">Select experience...</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                What can you do?
              </label>
              <textarea
                value={service.description}
                onChange={(e) => updateService(service.name, 'description', e.target.value)}
                placeholder="I can fix taps, install toilets, repair pipes. I have 5 years experience..."
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-base text-gray-900 leading-relaxed resize-none placeholder:text-gray-400"
                rows={4}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function AvailabilityStep({ formData, setFormData }: any) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
  }

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Location not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          const location = data.address.suburb || data.address.city || data.address.town || 'Unknown'
          setFormData((prev: any) => ({
            ...prev,
            primaryLocation: location,
            locationCoords: { lat: latitude, lng: longitude }
          }))
        } catch {
          setFormData((prev: any) => ({
            ...prev,
            primaryLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            locationCoords: { lat: latitude, lng: longitude }
          }))
        }
        setIsGettingLocation(false)
      },
      () => {
        alert('Could not get your location')
        setIsGettingLocation(false)
      }
    )
  }

  return (
    <>
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl">📍</span>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-2">Where & When Can You Work?</h2>
            <p className="text-blue-50 font-medium">Set your location and available days</p>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
          <label className="text-base font-bold text-gray-900">Your Primary Location</label>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.primaryLocation}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, primaryLocation: e.target.value }))}
              placeholder="e.g., Soweto, Sandton, Johannesburg..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={getMyLocation}
            disabled={isGettingLocation}
            className="w-full py-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-2 border-blue-300 rounded-xl font-bold active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:shadow-md"
          >
            {isGettingLocation ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Use My Current Location
              </>
            )}
          </button>
        </div>
      </div>

      {/* Days Availability Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📅</span>
          <label className="text-base font-bold text-gray-900">Which days are you usually free?</label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {days.map((day) => {
            const isSelected = formData.availability[day]
            return (
              <button
                key={day}
                onClick={() => setFormData((prev: any) => ({
                  ...prev,
                  availability: { ...prev.availability, [day]: !prev.availability[day] }
                }))}
                className={`py-5 rounded-xl border-2 font-bold text-base active:scale-95 transition-all ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {isSelected && <Check className="w-5 h-5 mx-auto mb-1" />}
                {dayLabels[day]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✍️</span>
          <label className="text-base font-bold text-gray-900">Tell us about yourself</label>
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
          placeholder="I am hardworking and reliable. I always arrive on time and do quality work. I have 5 years experience..."
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base text-gray-900 leading-relaxed resize-none placeholder:text-gray-400"
          rows={5}
        />
        <p className="text-sm text-gray-600 mt-2">A good bio helps clients trust you and choose your services</p>
      </div>
    </>
  )
}

function ReviewStep({ formData }: any) {
  const selectedDays = Object.entries(formData.availability)
    .filter(([_, isSelected]) => isSelected)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))

  return (
    <>
      {/* Header Card */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl">✅</span>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
            <p className="text-green-50 font-medium">Check everything looks good before completing</p>
          </div>
        </div>
      </div>

      {/* Services Summary */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">💼</span>
          Your Services ({formData.services.length})
        </h3>
        <div className="space-y-3">
          {formData.services.map((service: Service) => (
            <div key={service.name} className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-base capitalize">{service.name}</h4>
                  {service.experience && (
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      Experience: {service.experience} years
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-emerald-600">
                    R{service.rate}/{service.rateType}
                  </div>
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-gray-700 leading-relaxed mt-2 bg-white/50 p-3 rounded-lg">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location & Days Summary */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📍</span>
          Location & Availability
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Primary Area:</p>
            <div className="px-4 py-3 bg-blue-50 text-blue-900 rounded-lg font-semibold text-base border-2 border-blue-200 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {formData.primaryLocation}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Usually Available:</p>
            <div className="flex flex-wrap gap-2">
              {selectedDays.length > 0 ? (
                selectedDays.map(day => (
                  <span key={day} className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold border-2 border-emerald-200">
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No days selected</span>
              )}
            </div>
          </div>

          {formData.bio && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">About You:</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                {formData.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-5xl">🎉</span>
        </div>
        <h3 className="font-bold text-2xl mb-3 text-white">Almost There!</h3>
        <p className="text-white font-medium text-base">
          Click "Complete Setup" below to activate your profile and start getting job requests
        </p>
      </div>
    </>
  )
}