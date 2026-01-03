// components/WorkerNavigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function WorkerNavigation() {
  const pathname = usePathname()

  const navItems = [
    { 
      href: '/worker/dashboard', 
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      href: '/worker/jobs', 
      label: 'Jobs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      href: '/worker/profile', 
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full relative group"
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-full"></div>
                )}
                
                {/* Icon */}
                <div className={`transition-all duration-200 ${
                  isActive 
                    ? 'text-emerald-600 scale-110' 
                    : 'text-gray-400 group-hover:text-gray-600 group-active:scale-95'
                }`}>
                  <div className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-emerald-50' : 'group-hover:bg-gray-50'
                  }`}>
                    {item.icon}
                  </div>
                </div>
                
                {/* Label */}
                <span className={`text-xs mt-1 font-medium transition-all ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}