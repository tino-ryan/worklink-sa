// types/database.ts
// This file contains Supabase database types
// You can generate these from your Supabase schema using:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          phone_number?: string | null
          full_name: string
          profile_photo_url?: string | null
          video_intro_url?: string | null
          bio?: string | null
          primary_location?: string | null
          areas_served?: string[] | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          verification_type?: string | null
          status?: 'pending' | 'active' | 'suspended'
          total_jobs?: number
          average_rating?: number | null
          email?: string | null
          user_type?: 'client' | 'worker' | 'both'
        }
        Update: {
          id?: string
          user_id?: string
          phone_number?: string | null
          full_name?: string
          profile_photo_url?: string | null
          video_intro_url?: string | null
          bio?: string | null
          primary_location?: string | null
          areas_served?: string[] | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          verification_type?: string | null
          status?: 'pending' | 'active' | 'suspended'
          total_jobs?: number
          average_rating?: number | null
          email?: string | null
          user_type?: 'client' | 'worker' | 'both'
        }
      }
      services: {
        Row: {
          id: string
          worker_id: string
          category: string
          pricing_type: 'hourly' | 'fixed' | 'daily'
          price_min: number
          price_max: number | null
          description: string | null
          created_at: string
          years_experience: number | null
        }
        Insert: {
          id?: string
          worker_id: string
          category: string
          pricing_type: 'hourly' | 'fixed' | 'daily'
          price_min: number
          price_max?: number | null
          description?: string | null
          created_at?: string
          years_experience?: number | null
        }
        Update: {
          id?: string
          worker_id?: string
          category?: string
          pricing_type?: 'hourly' | 'fixed' | 'daily'
          price_min?: number
          price_max?: number | null
          description?: string | null
          created_at?: string
          years_experience?: number | null
        }
      }
      availability: {
        Row: {
          id: string
          worker_id: string
          available_today: boolean
          last_toggled: string | null
          weekly_schedule: Json | null
          unavailable_dates: string[] | null
        }
        Insert: {
          id?: string
          worker_id: string
          available_today?: boolean
          last_toggled?: string | null
          weekly_schedule?: Json | null
          unavailable_dates?: string[] | null
        }
        Update: {
          id?: string
          worker_id?: string
          available_today?: boolean
          last_toggled?: string | null
          weekly_schedule?: Json | null
          unavailable_dates?: string[] | null
        }
      }
      work_photos: {
        Row: {
          id: string
          worker_id: string
          photo_url: string
          caption: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          photo_url: string
          caption?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          photo_url?: string
          caption?: string | null
          uploaded_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          worker_id: string
          client_id: string
          rating: number
          comment: string | null
          job_category: string | null
          created_at: string
          is_verified_hire: boolean
        }
        Insert: {
          id?: string
          worker_id: string
          client_id: string
          rating: number
          comment?: string | null
          job_category?: string | null
          created_at?: string
          is_verified_hire?: boolean
        }
        Update: {
          id?: string
          worker_id?: string
          client_id?: string
          rating?: number
          comment?: string | null
          job_category?: string | null
          created_at?: string
          is_verified_hire?: boolean
        }
      }
      job_posts: {
        Row: {
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
        }
        Insert: {
          id?: string
          client_id: string
          category: string
          description: string
          location: string
          date_needed: string
          time_preference: 'morning' | 'afternoon' | 'evening' | 'flexible'
          budget_min?: number | null
          budget_max?: number | null
          status?: 'open' | 'filled' | 'cancelled'
          interested_count?: number
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          category?: string
          description?: string
          location?: string
          date_needed?: string
          time_preference?: 'morning' | 'afternoon' | 'evening' | 'flexible'
          budget_min?: number | null
          budget_max?: number | null
          status?: 'open' | 'filled' | 'cancelled'
          interested_count?: number
          created_at?: string
          expires_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}