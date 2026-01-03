// components/ServiceCategoriesModal.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/types'

export default function ServiceCategoriesModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
      >
        View All
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">All Services</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/browse?category=${cat.value}`}
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg p-3 transition-all group"
                  >
                    <div className="text-center space-y-1.5">
                      <div className="text-3xl mx-auto">{getCategoryIcon(cat.value)}</div>
                      <div className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700 line-clamp-2 leading-tight">
                        {cat.label}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    gardening: '🌿',
    cleaning: '🧹',
    plumbing: '🔧',
    electrical: '⚡',
    painting: '🎨',
    construction: '🏗️',
    moving: '📦',
    childcare: '👶',
    driving: '🚗',
    cooking: '👨‍🍳',
    handyman: '🔨',
    security: '🛡️',
    laundry: '🧺',
    tutoring: '📚',
    beauty: '💇',
    fitness: '💪',
    photography: '📸',
    catering: '🍽️',
    tailoring: '🧵',
    mechanic: '🔩'
  }
  return icons[category] || '💼'
}