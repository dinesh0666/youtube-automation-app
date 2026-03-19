import { NextRequest, NextResponse } from 'next/server'
import { getAllContent, createContent, isPipelinePaused } from '@/lib/sheets'

// GET /api/content — fetch all content items from Google Sheets
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined
    const data = await getAllContent(status)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST /api/content — add new row to Google Sheets + trigger n8n
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const item = await createContent({
      case_name: body.case_name,
      language: body.language || 'english',
      channel_slot: body.channel_slot || 1,
      content_type: body.content_type || 'india',
      notes: body.notes,
      scheduled_publish_at: body.scheduled_publish_at,
      source: 'manual',
    })

    // Trigger n8n only if pipeline is not paused
    const paused = await isPipelinePaused()
    if (!paused) {
      await triggerN8nProducer(item.id)
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

async function triggerN8nProducer(contentId: string) {
  const n8nUrl = process.env.N8N_WEBHOOK_URL
  const path = process.env.N8N_PRODUCER_WEBHOOK_PATH
  try {
    await fetch(`${n8nUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-secret': process.env.N8N_CALLBACK_SECRET || '',
      },
      body: JSON.stringify({ content_id: contentId }),
    })
  } catch (e) {
    console.error('Failed to trigger n8n:', e)
  }
}
