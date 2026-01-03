// components/WorkerPhotoGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  photo_url: string
  caption?: string | null
}


export default function WorkerPhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <Image
            src={photo.photo_url}
            alt={photo.caption || 'Work photo'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          {photo.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm font-medium line-clamp-2">
                {photo.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}