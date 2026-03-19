import { NextRequest, NextResponse } from 'next/server'
import { getContentById, getLogsForContent } from '@/lib/sheets'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await getContentById(id)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    const logs = await getLogsForContent(id)
    return NextResponse.json({ ...item, logs })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
