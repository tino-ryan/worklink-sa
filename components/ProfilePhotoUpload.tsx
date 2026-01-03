// components/ProfilePhotoUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { uploadProfilePhoto as updateProfilePhotoAction } from '@/app/actions/worker'
import { uploadProfilePhoto, compressImage } from '@/lib/storage'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  currentPhotoUrl?: string | null
}

export default function ProfilePhotoUpload({ userId, currentPhotoUrl }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Compress image
      const compressedFile = await compressImage(file, 800, 800, 0.85)

      // Upload to Supabase Storage
      const photoUrl = await uploadProfilePhoto(compressedFile, userId)

      // Update profile in database
      const result = await updateProfilePhotoAction(photoUrl)

      if (result.error) {
        alert('Failed to update profile photo: ' + result.error)
        setPreviewUrl(currentPhotoUrl || null)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('Failed to upload photo: ' + error.message)
      setPreviewUrl(currentPhotoUrl || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">Profile Photo</h2>
          <p className="text-sm text-gray-600">Upload a clear photo of yourself</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden relative">
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Change Photo'}
          </button>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
        </div>
      </div>
    </div>
  )
}