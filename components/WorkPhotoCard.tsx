// components/WorkPhotoCard.tsx
'use client'

import { useState, useTransition } from 'react'
import { deleteWorkPhoto, updatePhotoCaption } from '@/app/actions/worker'
import { useRouter } from 'next/navigation'

interface Props {
  photo: {
    id: string
    photo_url: string
    caption: string | null
  }
}

export default function WorkPhotoCard({ photo }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(photo.caption || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSaveCaption = () => {
    startTransition(async () => {
      await updatePhotoCaption(photo.id, caption)
      setIsEditing(false)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteWorkPhoto(photo.id)
      router.refresh()
    })
  }

  return (
    <div className="relative group">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-purple-100 group-hover:border-purple-300 transition-colors">
        <img
          src={photo.photo_url}
          alt={photo.caption || 'Work photo'}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add caption..."
                className="w-full px-3 py-2 bg-white/90 rounded-lg text-sm text-gray-900 font-medium"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCaption}
                  disabled={isPending}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg text-sm font-bold active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {photo.caption && (
                <p className="text-white text-sm font-medium mb-2">{photo.caption}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 bg-white/90 text-gray-900 rounded-lg text-sm font-bold active:scale-95 transition-all"
                >
                  Edit Caption
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold active:scale-95 transition-all"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Photo?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This photo will be permanently removed from your gallery.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}