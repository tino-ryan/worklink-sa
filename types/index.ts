// types/index.ts

export interface Profile {
  id: string
  user_id: string
  phone_number: string | null
  full_name: string
  profile_photo_url: string | null
  video_intro_url: string | null
  bio: string | null
  primary_location: string | null
  areas_served: string[] | null
  created_at: string
  updated_at: string
  is_verified: boolean
  verification_type: string | null
  status: 'pending' | 'active' | 'suspended'
  total_jobs: number
  average_rating: number | null
  email: string | null
  user_type: 'client' | 'worker' | 'both'
}

export interface Service {
  id: string
  worker_id: string
  category: string
  pricing_type: 'hourly' | 'fixed' | 'daily'
  price_min: number
  price_max: number | null
  description: string | null
  created_at: string
  years_experience?: number | null 
}

export interface Availability {
  id: string
  worker_id: string
  available_today: boolean
  last_toggled: string | null
  weekly_schedule: {
    monday?: boolean
    tuesday?: boolean
    wednesday?: boolean
    thursday?: boolean
    friday?: boolean
    saturday?: boolean
    sunday?: boolean
  } | null
  unavailable_dates: string[] | null
}

export interface WorkPhoto {
  id: string
  worker_id: string
  photo_url: string
  caption?: string | null
  uploaded_at: string
}

export interface Review {
  id: string
  worker_id: string
  client_id: string
  rating: number
  comment: string | null
  job_category: string | null
  created_at: string
  is_verified_hire: boolean
  client?: {
    full_name: string
    profile_photo_url: string | null
  }
}

export interface JobPost {
  id: string
  client_id: string
  category: string
  description: string
  location: string
  date_needed: string
  time_preference: 'morning' | 'afternoon' | 'evening' | 'flexible'
  budget_min: number | null
  budget_max: number | null
  status: 'open' | 'filled' | 'cancelled'
  interested_count: number
  created_at: string
  expires_at: string | null
  client?: Profile
}

export interface WorkerWithDetails extends Profile {
  services: Service[]
  availability: Availability | null
  work_photos: WorkPhoto[]
  reviews: Review[]
  distance_km?: number
}

export interface SearchFilters {
  category?: string
  location?: string
  availableToday?: boolean
  lat?: number
  lng?: number
  radius?: number
}

export const CATEGORIES = [
  { value: 'gardening', label: 'Gardening', icon: '🌱' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'painting', label: 'Painting', icon: '🎨' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'carpentry', label: 'Carpentry', icon: '🪚' },
  { value: 'moving', label: 'Moving', icon: '📦' },
  { value: 'handyman', label: 'Handyman', icon: '🔨' },
  { value: 'other', label: 'Other', icon: '💼' },
] as const

export const SA_LOCATIONS = [
  'Soweto',
  'Alexandra',
  'Benoni',
  'Johannesburg CBD',
  'Sandton',
  'Randburg',
  'Roodepoort',
  'Kempton Park',
  'Boksburg',
  'Germiston',
  'Midrand',
  'Pretoria',
  'Centurion',
] as const

export type CategoryId = typeof CATEGORIES[number]['value']
export type SALocation = typeof SA_LOCATIONS[number]