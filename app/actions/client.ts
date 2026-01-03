//app/actions/client.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from './auth'
import type { SearchFilters, WorkerWithDetails } from '@/types'

// Search workers with geospatial filtering
// REPLACE your existing searchWorkers function in app/actions/client.ts with this:

// SUPER SIMPLE DEBUG - Test step by step
// Replace searchWorkers in app/actions/client.ts with this:



// Fix BOTH searchWorkers and getWorkerDetails
// Replace both functions in app/actions/client.ts

export async function searchWorkers(filters: SearchFilters, page: number = 1, limit: number = 12) {
  const supabase = await createServerSupabaseClient()
  
  try {
    console.log('🔍 Fetching workers...')
    
    // Simplified query - skip reviews for now since they're causing issues
    const { data: allWorkers, error: workersError } = await supabase
      .from('profiles')
      .select(`
        *,
        services (*),
        availability (*),
        work_photos (*)
      `)
      .eq('user_type', 'worker')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (workersError) {
      console.error('❌ Query error:', workersError)
      return { workers: [], total: 0, page: 1, totalPages: 0 }
    }

    if (!allWorkers || allWorkers.length === 0) {
      console.log('⚠️ No workers found')
      return { workers: [], total: 0, page: 1, totalPages: 0 }
    }

    console.log(`✅ Found ${allWorkers.length} workers`)

    // Manually fetch reviews for each worker (workaround for relation issue)
    const workersWithReviews = await Promise.all(
      allWorkers.map(async (worker) => {
        const { data: reviews } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            client_id
          `)
          .eq('worker_id', worker.id)
          .order('created_at', { ascending: false })

        return {
          ...worker,
          reviews: reviews || []
        }
      })
    )

    // Apply filters
    let filteredWorkers = workersWithReviews as WorkerWithDetails[]

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filteredWorkers = filteredWorkers.filter(worker => 
        worker.services && worker.services.some(s => s.category === filters.category)
      )
      console.log(`📂 After category filter: ${filteredWorkers.length} workers`)
    }

    // Filter by availability
    if (filters.availableToday) {
      filteredWorkers = filteredWorkers.filter(worker => 
        worker.availability && worker.availability.available_today === true
      )
      console.log(`⏰ After availability filter: ${filteredWorkers.length} workers`)
    }

    // Filter by location
    if (filters.location) {
      filteredWorkers = filteredWorkers.filter(worker =>
        worker.primary_location && 
        worker.primary_location.toLowerCase().includes(filters.location!.toLowerCase())
      )
      console.log(`📍 After location filter: ${filteredWorkers.length} workers`)
    }

    // Pagination
    const total = filteredWorkers.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedWorkers = filteredWorkers.slice(offset, offset + limit)

    console.log(`✅ Returning ${paginatedWorkers.length} workers (page ${page}/${totalPages})`)

    return {
      workers: paginatedWorkers,
      total,
      page,
      totalPages
    }
  } catch (error: any) {
    console.error('❌ Exception:', error)
    return { workers: [], total: 0, page: 1, totalPages: 0 }
  }
}

// Get single worker details - FIXED VERSION
export async function getWorkerDetails(workerId: string) {
  const supabase = await createServerSupabaseClient()

  try {
    console.log(`🔍 Fetching worker details for ID: ${workerId}`)

    // Query without nested client relation in reviews
    const { data: worker, error } = await supabase
      .from('profiles')
      .select(`
        *,
        services (*),
        availability (*),
        work_photos (*)
      `)
      .eq('id', workerId)
      .eq('user_type', 'worker')
      .single()

    if (error) {
      console.error('❌ Get worker error:', error)
      return { worker: null, error: error.message }
    }

    if (!worker) {
      console.log('⚠️ Worker not found')
      return { worker: null, error: 'Worker not found' }
    }

    console.log(`✅ Found worker: ${worker.full_name}`)

    // Fetch reviews separately (workaround for relation issue)
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        job_category,
        is_verified_hire,
        client_id
      `)
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false })

    console.log(`✅ Found ${reviews?.length || 0} reviews`)

    // Fetch client info for reviews
    const reviewsWithClients = await Promise.all(
      (reviews || []).map(async (review) => {
        const { data: client } = await supabase
          .from('profiles')
          .select('full_name, profile_photo_url')
          .eq('id', review.client_id)
          .single()

        return {
          ...review,
          client: client || null
        }
      })
    )

    const workerWithReviews = {
      ...worker,
      reviews: reviewsWithClients
    }

    console.log(`✅ Complete worker data assembled`)

    return { worker: workerWithReviews as WorkerWithDetails }
  } catch (error: any) {
    console.error('❌ Get worker details exception:', error)
    return { worker: null, error: error.message }
  }
}


// Track interaction (profile view, WhatsApp click, etc.)
export async function trackInteraction(
  workerId: string,
  interactionType: 'profile_view' | 'whatsapp_click' | 'call' | 'hire',
  jobPostId?: string
) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  try {
    const { error } = await supabase
      .from('interactions')
      .insert({
        worker_id: workerId,
        client_id: profile.id,
        interaction_type: interactionType,
        job_post_id: jobPostId || null
      })

    if (error) {
      console.error('Track interaction error:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Track interaction exception:', error)
    return { error: error.message }
  }
}

// Save/bookmark worker
export async function toggleSaveWorker(workerId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Track as interaction for MVP
    await trackInteraction(workerId, 'profile_view')
    
    revalidatePath('/browse')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Post a job
export async function postJob(formData: FormData) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const jobData = {
    client_id: profile.id,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    location: formData.get('location') as string,
    date_needed: formData.get('date_needed') as string,
    time_preference: formData.get('time_preference') as string,
    budget_min: parseInt(formData.get('budget_min') as string) || null,
    budget_max: parseInt(formData.get('budget_max') as string) || null,
    status: 'open',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  try {
    const { data: job, error } = await supabase
      .from('job_posts')
      .insert(jobData)
      .select()
      .single()

    if (error) {
      console.error('Post job error:', error)
      return { error: error.message }
    }

    revalidatePath('/jobs')
    return { success: true, jobId: job.id }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Get client's jobs
export async function getClientJobs(status?: 'open' | 'filled' | 'cancelled') {
  const user = await getUser()
  if (!user) return { jobs: [], error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { jobs: [], error: 'Profile not found' }

  try {
    let query = supabase
      .from('job_posts')
      .select('*')
      .eq('client_id', profile.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: jobs, error } = await query

    if (error) {
      return { jobs: [], error: error.message }
    }

    return { jobs: jobs || [] }
  } catch (error: any) {
    return { jobs: [], error: error.message }
  }
}

// Submit review
export async function submitReview(formData: FormData) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const reviewData = {
    worker_id: formData.get('worker_id') as string,
    client_id: profile.id,
    rating: parseInt(formData.get('rating') as string),
    comment: formData.get('comment') as string,
    job_category: formData.get('job_category') as string,
    is_verified_hire: formData.get('is_verified_hire') === 'true'
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .insert(reviewData)

    if (error) {
      return { error: error.message }
    }

    // Update worker's average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('worker_id', reviewData.worker_id)

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      
      await supabase
        .from('profiles')
        .update({ 
          average_rating: avgRating,
          total_jobs: reviews.length
        })
        .eq('id', reviewData.worker_id)
    }

    revalidatePath(`/worker/${reviewData.worker_id}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Update job status
export async function updateJobStatus(jobId: string, status: 'open' | 'filled' | 'cancelled') {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: job } = await supabase
      .from('job_posts')
      .select('client_id')
      .eq('id', jobId)
      .single()

    if (!job || job.client_id !== profile.id) {
      return { error: 'Job not found' }
    }

    const { error } = await supabase
      .from('job_posts')
      .update({ status })
      .eq('id', jobId)

    if (error) throw error

    revalidatePath('/client/jobs')
    revalidatePath(`/client/jobs/${jobId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Update job status error:', error)
    return { error: error.message || 'Failed to update job status' }
  }
}

// Delete job post
export async function deleteJobPost(jobId: string) {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  try {
    // Verify ownership
    const { data: job } = await supabase
      .from('job_posts')
      .select('client_id')
      .eq('id', jobId)
      .single()

    if (!job || job.client_id !== profile.id) {
      return { error: 'Job not found' }
    }

    // Delete interactions first (foreign key constraint)
    await supabase
      .from('interactions')
      .delete()
      .eq('job_post_id', jobId)

    // Delete job post
    const { error } = await supabase
      .from('job_posts')
      .delete()
      .eq('id', jobId)

    if (error) throw error

    revalidatePath('/client/jobs')
    return { success: true }
  } catch (error: any) {
    console.error('Delete job error:', error)
    return { error: error.message || 'Failed to delete job' }
  }
}