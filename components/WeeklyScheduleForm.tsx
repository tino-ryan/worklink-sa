// components/WeeklyScheduleForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { updateWeeklySchedule } from '@/app/actions/worker'

interface Props {
  workerId: string
  initialSchedule: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
}

export default function WeeklyScheduleForm({ workerId, initialSchedule }: Props) {
  const [schedule, setSchedule] = useState(initialSchedule)
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)

  const days = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' },
  ]

  const toggleDay = (day: string) => {
    setSchedule(prev => ({ ...prev, [day]: !prev[day as keyof typeof prev] }))
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateWeeklySchedule(schedule)
      
      if (result.error) {
        alert('Failed to update schedule')
      } else {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {days.map((day) => (
          <button
            key={day.key}
            type="button"
            onClick={() => toggleDay(day.key)}
            className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
              schedule[day.key as keyof typeof schedule]
                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {schedule[day.key as keyof typeof schedule] && (
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="block sm:hidden">{day.short}</span>
            <span className="hidden sm:block">{day.label}</span>
          </button>
        ))}
      </div>

      {/* Save Button */}
      <div className="relative">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            'Save Schedule'
          )}
        </button>

        {/* Success Feedback */}
        {showSuccess && (
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-bounce whitespace-nowrap">
            ✓ Schedule Updated!
          </div>
        )}
      </div>
    </div>
  )
}