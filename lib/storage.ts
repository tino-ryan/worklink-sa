// lib/storage.ts
import { createBrowserClient } from '@supabase/ssr'

const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Upload a profile photo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @returns The public URL of the uploaded image
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const supabase = createClient()
  
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }
  
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB')
  }
  
  // Create unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/profile-${Date.now()}.${fileExt}`
  
  // Upload to storage
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(data.path)
  
  return publicUrl
}

/**
 * Upload a work photo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @returns The public URL of the uploaded image
 */
export async function uploadWorkPhoto(file: File, userId: string): Promise<string> {
  const supabase = createClient()
  
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }
  
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB')
  }
  
  // Create unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/work-${Date.now()}.${fileExt}`
  
  // Upload to storage
  const { data, error } = await supabase.storage
    .from('work-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('work-photos')
    .getPublicUrl(data.path)
  
  return publicUrl
}

/**
 * Delete a photo from storage
 * @param bucket - The storage bucket name
 * @param path - The file path
 */
export async function deletePhoto(bucket: 'profile-photos' | 'work-photos', path: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Compress and resize image before upload
 * @param file - The image file
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - Image quality (0-1)
 * @returns Compressed file
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            
            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}