// app/api/track-interaction/route.ts
import { trackInteraction } from '@/app/actions/client'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { workerId, type } = await req.json()
    const result = await trackInteraction(workerId, type as any)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}