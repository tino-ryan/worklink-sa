// components/DeleteServiceButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { deleteService } from '@/app/actions/worker'
import { useRouter } from 'next/navigation'

interface Props {
  serviceId: string
  serviceName: string
}

export default function DeleteServiceButton({ serviceId, serviceName }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteService(serviceId)
      
      if (result.error) {
        alert('Failed to delete service: ' + result.error)
      } else {
        router.refresh()
      }
      setShowConfirm(false)
    })
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Service?
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete <strong className="text-gray-900 capitalize">{serviceName}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Delete
    </button>
  )
}