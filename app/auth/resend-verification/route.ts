// app/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/email/${email}/resend`, {
    method: 'POST',
    headers: {
      apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.msg || 'Failed to resend verification email' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
