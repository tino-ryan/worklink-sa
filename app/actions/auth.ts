// app/actions/auth.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    userType: formData.get('userType') as 'client' | 'worker',
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: authData.user.id,
    email: data.email,
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    user_type: data.userType,
    status: 'pending',
  })

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/verify-email')
}

export async function login(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return profile
}