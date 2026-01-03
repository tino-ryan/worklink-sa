// components/AvailabilityToggle.tsx
'use client'

import { useState, useTransition } from 'react'
import { toggleAvailability } from '@/app/actions/worker'

interface Props {
  workerId: string
  initialStatus: boolean
}

export default function AvailabilityToggle({ workerId, initialStatus }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [showFeedback, setShowFeedback] = useState(false)

  const handleToggle = () => {
    const newStatus = !isAvailable
    setIsAvailable(newStatus)
    
    startTransition(async () => {
      const result = await toggleAvailability(newStatus)
      
      if (result.error) {
        setIsAvailable(!newStatus)
        alert('Failed to update availability')
      } else {
        setShowFeedback(true)
        setTimeout(() => setShowFeedback(false), 2000)
      }
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {isAvailable ? 'Available' : 'Not Available'}
          </p>
          <p className="text-xs text-gray-600">
            {isAvailable ? 'Visible to clients' : 'Hidden from search'}
          </p>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-10 w-16 items-center rounded-full transition-all duration-300 shadow-md active:scale-95 ${
            isAvailable ? 'bg-emerald-600 shadow-emerald-200' : 'bg-gray-300'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
        >
          <span
            className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
              isAvailable ? 'translate-x-7' : 'translate-x-1'
            }`}
          >
            {isPending ? (
              <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isAvailable ? (
              <span className="text-emerald-600">✓</span>
            ) : (
              <span className="text-gray-400">×</span>
            )}
          </span>
        </button>
      </div>

      {/* Success Feedback */}
      {showFeedback && (
        <div className="absolute -top-12 right-0 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce">
          Updated! ✓
        </div>
      )}
    </div>
  )
}

