import { NextRequest, NextResponse } from 'next/server'
import { getContentById, updateContent } from '@/lib/sheets'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const { action, reason, edit_notes } = body
    const { id: contentId } = await params

    const item = await getContentById(contentId)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL
    const secret = process.env.N8N_CALLBACK_SECRET

    if (action === 'approve') {
      await updateContent(contentId, { approved_at: new Date().toISOString() })
      await fetch(`${n8nUrl}${process.env.N8N_PUBLISHER_WEBHOOK_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-n8n-secret': secret || '' },
        body: JSON.stringify({ content_id: contentId, action: 'approve' }),
      })

    } else if (action === 'reject') {
      await updateContent(contentId, {
        status: 'queued',
        rejection_reason: reason,
        rejection_count: (item.rejection_count || 0) + 1,
        script: undefined, voice_url: undefined,
        image_urls: undefined, video_url: undefined,
      })

    } else if (action === 'edit') {
      const updatedNotes = item.notes
        ? `${item.notes}\n\nREWRITE REQUEST: ${edit_notes}`
        : `REWRITE REQUEST: ${edit_notes}`
      await updateContent(contentId, {
        status: 'queued', notes: updatedNotes,
        script: undefined, voice_url: undefined,
        image_urls: undefined, video_url: undefined,
      })
      await fetch(`${n8nUrl}${process.env.N8N_PRODUCER_WEBHOOK_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-n8n-secret': secret || '' },
        body: JSON.stringify({ content_id: contentId, start_from: 'scripting' }),
      })

    } else if (action === 'cancel') {
      await updateContent(contentId, { status: 'cancelled' })

    } else if (action === 'retry') {
      await updateContent(contentId, {
        status: 'queued',
        error_message: undefined, failed_step: undefined,
        retry_count: (item.retry_count || 0) + 1,
      })
      await fetch(`${n8nUrl}${process.env.N8N_PRODUCER_WEBHOOK_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-n8n-secret': secret || '' },
        body: JSON.stringify({ content_id: contentId }),
      })
    }

    const updated = await getContentById(contentId)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
