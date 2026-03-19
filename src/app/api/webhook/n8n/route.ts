import { NextRequest, NextResponse } from 'next/server'
import { updateContent, appendLog } from '@/lib/sheets'
import { N8nWebhookPayload } from '@/lib/types'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-n8n-secret')
  if (secret !== process.env.N8N_CALLBACK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload: N8nWebhookPayload = await req.json()
    const { content_id, step, status, message, duration_ms, data } = payload

    const stepToStatus: Record<string, string> = {
      researching: 'researching', scripting: 'scripting',
      reviewing: 'reviewing', voicing: 'voicing',
      imaging: 'imaging', rendering: 'rendering',
      awaiting_approval: 'awaiting_approval', publishing: 'publishing',
      scheduled: 'scheduled', published: 'published', failed: 'failed',
    }

    // Build update object
    const updates: Record<string, unknown> = {}

    if (stepToStatus[step]) updates.status = stepToStatus[step]

    if (status === 'failed') {
      updates.status = 'failed'
      updates.failed_step = step
      updates.error_message = message
    }

    // Merge any data from n8n (script, urls, titles etc.)
    if (data) Object.assign(updates, data)

    // Write to Google Sheets
    await updateContent(content_id, updates as any)

    // Append to Logs sheet
    await appendLog({
      content_id,
      workspace_id: 'default',
      step,
      status: status as any,
      message,
      duration_ms,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('n8n webhook error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
