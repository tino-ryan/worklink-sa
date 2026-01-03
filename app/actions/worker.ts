// app/actions/worker.ts - COMPLETE FIXED VERSION
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser, getProfile } from './auth'

// ============================================
// PROFILE MANAGEMENT
// ============================================

export async function updateWorkerProfile(data: {
  full_name?: string
  bio?: string
  primary_location?: string
  phone_number?: string
}) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    const updateData: any = {}
    if (data.full_name !== undefined) updateData.full_name = data.full_name
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.primary_location !== undefined) updateData.primary_location = data.primary_location
    if (data.phone_number !== undefined) updateData.phone_number = data.phone_number

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profile.id)

    if (error) throw error

    revalidatePath('/worker/profile')
    revalidatePath('/worker/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Update profile error:', error)
    return { error: error.message || 'Failed to update profile' }
  }
}

export async function uploadProfilePhoto(photoUrl: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_photo_url: photoUrl })
      .eq('id', profile.id)

    if (error) throw error

    revalidatePath('/worker/profile')
    revalidatePath('/worker/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to upload photo' }
  }
}

// ============================================
// SERVICE MANAGEMENT
// ============================================

export async function addService(data: {
  category: string
  pricing_type: 'hourly' | 'fixed' | 'daily'
  price_min: number
  price_max?: number
  description: string
}) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Check if service already exists
    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('worker_id', profile.id)
      .eq('category', data.category.toLowerCase())
      .single()

    if (existing) {
      return { error: 'You already offer this service. Please edit it instead.' }
    }

    const { error } = await supabase
      .from('services')
      .insert({
        worker_id: profile.id,
        category: data.category.toLowerCase(),
        pricing_type: data.pricing_type,
        price_min: data.price_min,
        price_max: data.price_max || data.price_min,
        description: data.description
      })

    if (error) throw error

    revalidatePath('/worker/services')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Add service error:', error)
    return { error: error.message || 'Failed to add service' }
  }
}

export async function updateService(serviceId: string, data: {
  pricing_type?: 'hourly' | 'fixed' | 'daily'
  price_min?: number
  price_max?: number
  description?: string
}) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: service } = await supabase
      .from('services')
      .select('worker_id')
      .eq('id', serviceId)
      .single()

    if (!service || service.worker_id !== profile.id) {
      return { error: 'Service not found' }
    }

    const updateData: any = {}
    if (data.pricing_type !== undefined) updateData.pricing_type = data.pricing_type
    if (data.price_min !== undefined) updateData.price_min = data.price_min
    if (data.price_max !== undefined) updateData.price_max = data.price_max
    if (data.description !== undefined) updateData.description = data.description

    const { error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', serviceId)

    if (error) throw error

    revalidatePath('/worker/services')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Update service error:', error)
    return { error: error.message || 'Failed to update service' }
  }
}

export async function deleteService(serviceId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: service } = await supabase
      .from('services')
      .select('worker_id')
      .eq('id', serviceId)
      .single()

    if (!service || service.worker_id !== profile.id) {
      return { error: 'Service not found' }
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (error) throw error

    revalidatePath('/worker/services')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Delete service error:', error)
    return { error: error.message || 'Failed to delete service' }
  }
}

// ============================================
// AVAILABILITY MANAGEMENT - FIXED
// ============================================

export async function toggleAvailability(status: boolean) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Check if availability record exists
    const { data: existing, error: fetchError } = await supabase
      .from('availability')
      .select('id, weekly_schedule')
      .eq('worker_id', profile.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch error:', fetchError)
      throw fetchError
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('availability')
        .update({
          available_today: status,
          last_toggled: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('availability')
        .insert({
          worker_id: profile.id,
          available_today: status,
          last_toggled: new Date().toISOString(),
          weekly_schedule: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
          }
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }
    }

    revalidatePath('/worker/dashboard')
    revalidatePath('/worker/profile')
    revalidatePath('/worker/availability')
    return { success: true, status }
  } catch (error: any) {
    console.error('Toggle availability error:', error)
    return { 
      error: error.message || 'Failed to update availability'
    }
  }
}

export async function updateWeeklySchedule(schedule: {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Check if availability record exists
    const { data: existing, error: fetchError } = await supabase
      .from('availability')
      .select('id, available_today')
      .eq('worker_id', profile.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch error:', fetchError)
      throw fetchError
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('availability')
        .update({
          weekly_schedule: schedule,
          last_toggled: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Update schedule error:', updateError)
        throw updateError
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('availability')
        .insert({
          worker_id: profile.id,
          available_today: false,
          weekly_schedule: schedule,
          last_toggled: new Date().toISOString()
        })

      if (insertError) {
        console.error('Insert schedule error:', insertError)
        throw insertError
      }
    }

    revalidatePath('/worker/availability')
    revalidatePath('/worker/profile')
    revalidatePath('/worker/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Update schedule error:', error)
    return { 
      error: error.message || 'Failed to update schedule'
    }
  }
}

// ============================================
// WORK PHOTOS MANAGEMENT
// ============================================

export async function addWorkPhoto(photoUrl: string, caption?: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Check photo limit (max 5)
    const { count } = await supabase
      .from('work_photos')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', profile.id)

    if (count && count >= 5) {
      return { error: 'Maximum 5 work photos allowed. Please delete one first.' }
    }

    const { error } = await supabase
      .from('work_photos')
      .insert({
        worker_id: profile.id,
        photo_url: photoUrl,
        caption: caption || null
      })

    if (error) throw error

    revalidatePath('/worker/photos')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Add photo error:', error)
    return { error: error.message || 'Failed to add photo' }
  }
}

export async function deleteWorkPhoto(photoId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: photo } = await supabase
      .from('work_photos')
      .select('worker_id')
      .eq('id', photoId)
      .single()

    if (!photo || photo.worker_id !== profile.id) {
      return { error: 'Photo not found' }
    }

    const { error } = await supabase
      .from('work_photos')
      .delete()
      .eq('id', photoId)

    if (error) throw error

    revalidatePath('/worker/photos')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Delete photo error:', error)
    return { error: error.message || 'Failed to delete photo' }
  }
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: photo } = await supabase
      .from('work_photos')
      .select('worker_id')
      .eq('id', photoId)
      .single()

    if (!photo || photo.worker_id !== profile.id) {
      return { error: 'Photo not found' }
    }

    const { error } = await supabase
      .from('work_photos')
      .update({ caption })
      .eq('id', photoId)

    if (error) throw error

    revalidatePath('/worker/photos')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Update caption error:', error)
    return { error: error.message || 'Failed to update caption' }
  }
}

// ============================================
// ONBOARDING - FIXED
// ============================================

export async function completeOnboarding(data: {
  services: Array<{
    name: string
    rate: string
    rateType: 'hourly' | 'fixed'
    experience: string
    description: string
  }>
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  primaryLocation: string
  bio: string
}) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        primary_location: data.primaryLocation,
        bio: data.bio,
        status: 'active'
      })
      .eq('id', profile.id)

    if (profileError) throw profileError

    // Insert services (one at a time to handle duplicates)
    for (const service of data.services) {
      // Check if service already exists
      const { data: existing } = await supabase
        .from('services')
        .select('id')
        .eq('worker_id', profile.id)
        .eq('category', service.name.toLowerCase())
        .maybeSingle()

      if (!existing) {
        const { error: serviceError } = await supabase
          .from('services')
          .insert({
            worker_id: profile.id,
            category: service.name.toLowerCase(),
            pricing_type: service.rateType,
            price_min: parseInt(service.rate) || 0,
            price_max: parseInt(service.rate) || 0,
            description: service.description
          })

        if (serviceError) {
          console.error('Service insert error:', serviceError)
          // Don't fail entire onboarding if one service fails
        }
      }
    }

    // Handle availability - check if exists first
    const { data: existingAvail } = await supabase
      .from('availability')
      .select('id')
      .eq('worker_id', profile.id)
      .maybeSingle()

    if (existingAvail) {
      // Update existing
      const { error: availError } = await supabase
        .from('availability')
        .update({
          available_today: false,
          weekly_schedule: data.availability,
          last_toggled: new Date().toISOString()
        })
        .eq('id', existingAvail.id)

      if (availError) {
        console.error('Availability update error:', availError)
      }
    } else {
      // Insert new
      const { error: availError } = await supabase
        .from('availability')
        .insert({
          worker_id: profile.id,
          available_today: false,
          weekly_schedule: data.availability,
          last_toggled: new Date().toISOString()
        })

      if (availError) {
        console.error('Availability insert error:', availError)
      }
    }

    revalidatePath('/worker/dashboard')
    revalidatePath('/worker/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return { error: error.message || 'Failed to complete onboarding' }
  }
}

// ============================================
// JOB INTERACTIONS
// ============================================

export async function trackJobInterest(jobId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Get job details
    const { data: job } = await supabase
      .from('job_posts')
      .select('client_id, interested_count')
      .eq('id', jobId)
      .single()

    if (!job) return { error: 'Job not found' }

    // Track interaction
    await supabase
      .from('interactions')
      .insert({
        worker_id: profile.id,
        client_id: job.client_id,
        interaction_type: 'whatsapp_click',
        job_post_id: jobId
      })

    // Increment interested count
    await supabase
      .from('job_posts')
      .update({ interested_count: (job.interested_count || 0) + 1 })
      .eq('id', jobId)

    revalidatePath('/worker/jobs')
    return { success: true }
  } catch (error: any) {
    console.error('Track interest error:', error)
    return { error: error.message || 'Failed to track interest' }
  }
}

export async function saveJobForLater(jobId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Check if already saved
    const { data: existing } = await supabase
      .from('interactions')
      .select('id')
      .eq('worker_id', profile.id)
      .eq('job_post_id', jobId)
      .eq('interaction_type', 'saved')
      .single()

    if (existing) {
      // Unsave
      await supabase
        .from('interactions')
        .delete()
        .eq('id', existing.id)

      return { success: true, saved: false }
    } else {
      // Get job client
      const { data: job } = await supabase
        .from('job_posts')
        .select('client_id')
        .eq('id', jobId)
        .single()

      if (!job) return { error: 'Job not found' }

      // Save job
      await supabase
        .from('interactions')
        .insert({
          worker_id: profile.id,
          client_id: job.client_id,
          interaction_type: 'saved',
          job_post_id: jobId
        })

      return { success: true, saved: true }
    }
  } catch (error: any) {
    console.error('Save job error:', error)
    return { error: error.message || 'Failed to save job' }
  }
}

export async function getSavedJobs() {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    const { data: savedInteractions } = await supabase
      .from('interactions')
      .select('job_post_id')
      .eq('worker_id', profile.id)
      .eq('interaction_type', 'saved')

    const savedJobIds = savedInteractions?.map(i => i.job_post_id) || []

    if (savedJobIds.length === 0) {
      return { jobs: [] }
    }

    const { data: jobs } = await supabase
      .from('job_posts')
      .select(`
        *,
        profiles:client_id (
          full_name,
          profile_photo_url,
          phone_number
        )
      `)
      .in('id', savedJobIds)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    return { jobs: jobs || [] }
  } catch (error: any) {
    console.error('Get saved jobs error:', error)
    return { error: error.message || 'Failed to get saved jobs' }
  }
}

// ============================================
// STATS & ANALYTICS
// ============================================

export async function getWorkerStats() {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Get profile views
    const { count: views } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', profile.id)
      .eq('interaction_type', 'profile_view')

    return {
      totalJobs: profile.total_jobs || 0,
      rating: profile.average_rating || 0,
      views: views || 0
    }
  } catch (error: any) {
    console.error('Get stats error:', error)
    return { error: error.message || 'Failed to get stats' }
  }
}

// Express interest in a job with optional comment
export async function expressInterest(jobId: string, comment?: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('job_posts')
      .select('client_id, interested_count, category')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return { error: 'Job not found' }
    }

    // Check if already expressed interest
    const { data: existing } = await supabase
      .from('interactions')
      .select('id')
      .eq('worker_id', profile.id)
      .eq('job_post_id', jobId)
      .eq('interaction_type', 'interested')
      .maybeSingle()

    if (existing) {
      return { error: 'You have already expressed interest in this job' }
    }

    // Create interaction
    const { error: interactionError } = await supabase
      .from('interactions')
      .insert({
        worker_id: profile.id,
        client_id: job.client_id,
        interaction_type: 'interested',
        job_post_id: jobId,
        comment: comment || null
      })

    if (interactionError) throw interactionError

    // Increment interested count
    await supabase
      .from('job_posts')
      .update({ 
        interested_count: (job.interested_count || 0) + 1 
      })
      .eq('id', jobId)

    revalidatePath('/worker/jobs')
    revalidatePath(`/client/jobs/${jobId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Express interest error:', error)
    return { error: error.message || 'Failed to express interest' }
  }
}
