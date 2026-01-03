// components/LogoutButton.tsx
'use client'

import { logout } from '@/app/actions/auth'

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
    >
      Logout
    </button>
  )
}