'use client'

import ClientNav from './ClientNav'

interface Props {
  profile: {
    full_name: string
    user_type: string
  }
}

export default function ClientNavWrapper({ profile }: Props) {
  // Only show ClientNav if user is a client
  if (profile.user_type !== 'client') {
    return null
  }

  return <ClientNav profile={profile} />
}