// components/InfoTooltip.tsx
'use client'

import { useState } from 'react'

interface InfoTooltipProps {
  content: {
    en: string
    zu: string
    st: string
  }
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'zu' | 'st'>('en')

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 flex items-center justify-center text-sm font-bold transition-all active:scale-90 shadow-sm"
      >
        ?
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute left-0 top-8 z-50 w-80 bg-white rounded-xl shadow-2xl border-2 border-emerald-200 p-4 animate-fade-in">
            {/* Language Tabs */}
            <div className="flex gap-2 mb-3 pb-2 border-b border-gray-200">
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('zu')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  language === 'zu'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                isiZulu
              </button>
              <button
                onClick={() => setLanguage('st')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  language === 'st'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sesotho
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-800 text-sm leading-relaxed font-medium">
              {content[language]}
            </p>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl transition-colors active:scale-90"
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  )
}