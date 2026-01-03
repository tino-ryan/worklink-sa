// components/PhotoUploadZone.tsx
'use client'

import { useState, useCallback } from 'react'
import { addWorkPhoto } from '@/app/actions/worker'
import { useRouter } from 'next/navigation'
import { uploadWorkPhoto, compressImage } from '@/lib/storage'

interface Props {
  workerId: string
  userId: string
  currentCount: number
}

export default function PhotoUploadZone({ workerId, userId, currentCount }: Props) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    const remaining = 5 - currentCount
    const filesToUpload = files.slice(0, remaining)

    if (files.length > remaining) {
      alert(`You can only upload ${remaining} more photo${remaining !== 1 ? 's' : ''}`)
    }

    setUploading(true)

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i]
      
      try {
        setUploadProgress(`Uploading ${i + 1}/${filesToUpload.length}...`)
        
        // Compress image before upload
        const compressedFile = await compressImage(file, 1200, 1200, 0.85)
        
        // Upload to Supabase Storage
        const photoUrl = await uploadWorkPhoto(compressedFile, userId)
        
        // Save to database
        const result = await addWorkPhoto(photoUrl)
        
        if (result.error) {
          alert(`Failed to upload ${file.name}: ${result.error}`)
        }
      } catch (error: any) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}: ${error.message}`)
      }
    }

    setUploading(false)
    setUploadProgress('')
    router.refresh()
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="pointer-events-none">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {uploading ? (
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          {uploading ? (
            <>
              <p className="text-base font-bold text-purple-600 mb-2">Uploading...</p>
              <p className="text-sm text-gray-600">{uploadProgress}</p>
            </>
          ) : (
            <>
              <p className="text-base font-bold text-gray-900 mb-2">
                Drop photos here or click to browse
              </p>
              <p className="text-sm text-gray-600 mb-1">
                You can upload {5 - currentCount} more photo{5 - currentCount !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG up to 5MB each
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}