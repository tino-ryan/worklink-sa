// components/ProfileEditForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateWorkerProfile } from '@/app/actions/worker'
import InfoTooltip from '@/components/InfoTooltip'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'



interface Props {
  profile: any
}

export default function ProfileEditForm({ profile }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    primary_location: profile.primary_location || '',
    phone_number: profile.phone_number || '',
  })

  const LOCATIONS = [
    'Soweto', 'Alexandra', 'Johannesburg CBD', 'Sandton', 'Randburg',
    'Roodepoort', 'Benoni', 'Boksburg', 'Germiston', 'Pretoria',
    'Centurion', 'Midrand', 'Kempton Park'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await updateWorkerProfile(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/worker/profile')
        router.refresh()
      }, 1000)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Photo */}

    <ProfilePhotoUpload 
      userId={profile.user_id} 
      currentPhotoUrl={profile.profile_photo_url} 
    />


      {/* Full Name */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-base font-bold text-gray-900">
            Full Name
          </label>
          <InfoTooltip 
            content={{
              en: "Your full name as you want clients to see it",
              zu: "Igama lakho eligcwele njengoba ufuna amaklayenti abone",
              st: "Lebitso la hau le felletseng kamoo u batlang hore bareki ba le bone"
            }}
          />
        </div>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 placeholder:text-gray-500 font-medium transition-colors"
        />
      </div>

      {/* Phone Number */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-base font-bold text-gray-900">
            Phone Number
          </label>
          <InfoTooltip 
            content={{
              en: "Your contact number for clients to reach you",
              zu: "Inombolo yakho yokuxhumana ukuze amaklayenti akufinyelele",
              st: "Nomoro ea hau ea mohala bakeng sa bareki ho u fihlella"
            }}
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-4 text-gray-900 font-bold">+27</span>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            placeholder="81 234 5678"
            className="w-full pl-16 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 placeholder:text-gray-500 font-medium transition-colors"
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-base font-bold text-gray-900">
            Primary Location
          </label>
          <InfoTooltip 
            content={{
              en: "Where are you based? This helps clients find you",
              zu: "Uhlala kuphi? Lokhu kusiza amaklayenti bakuthole",
              st: "U ntse u le hokae? Sena se thusa bareki ho u fumana"
            }}
          />
        </div>
        <select
          value={formData.primary_location}
          onChange={(e) => handleChange('primary_location', e.target.value)}
          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 font-semibold bg-white appearance-none cursor-pointer transition-colors"
        >
          <option value="">Choose your area...</option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-base font-bold text-gray-900">
            About You
          </label>
          <InfoTooltip 
            content={{
              en: "Tell clients about yourself. What makes you great at your work?",
              zu: "Tshela amaklayenti ngawe. Yini ekwenza ube muhle emsebenzini wakho?",
              st: "Bolella bareki ka uena. Ke eng se etsang hore u be motle mosebetsing oa hau?"
            }}
          />
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Example: I am hardworking and reliable. I always arrive on time and do quality work. I have been doing this for 5 years."
          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-base text-gray-900 placeholder:text-gray-500 leading-relaxed transition-colors resize-none"
          rows={5}
        />
        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          A good description helps you get more clients
        </p>
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
            <p className="text-sm font-medium text-green-800">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-100 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Link
            href="/worker/profile"
            className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
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
    </form>
  )
}