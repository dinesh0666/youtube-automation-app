import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    const path = process.env.N8N_RESEARCHER_WEBHOOK_PATH
    const secret = process.env.N8N_CALLBACK_SECRET

    await fetch(`${n8nUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-secret': secret || '',
      },
      body: JSON.stringify({ manual: true }),
    })

    return NextResponse.json({ triggered: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
