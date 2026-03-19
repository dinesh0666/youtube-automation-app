import { NextRequest, NextResponse } from 'next/server'
import { isPipelinePaused, setPipelinePaused } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  try {
    const current = await isPipelinePaused()
    await setPipelinePaused(!current)
    return NextResponse.json({ paused: !current })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
