import { google } from 'googleapis'
import { ContentItem, ContentLog } from './types'

// Column positions in the Queue sheet (0-indexed)
const COLS = {
  id: 0, case_name: 1, language: 2, channel_slot: 3,
  content_type: 4, priority: 5, notes: 6, source: 7,
  status: 8, retry_count: 9, failed_step: 10, error_message: 11,
  script: 12, voice_url: 13, image_urls: 14, video_url: 15,
  yt_title: 16, yt_description: 17, yt_tags: 18,
  yt_video_id: 19, yt_url: 20,
  scheduled_publish_at: 21, published_at: 22,
  approval_requested_at: 23, approved_at: 24,
  rejection_reason: 25, rejection_count: 26,
  created_at: 27, updated_at: 28
}

const SHEET_QUEUE = 'Queue'
const SHEET_LOGS = 'Logs'
const SHEET_CONFIG = 'Config'
const SHEET_ID = process.env.GOOGLE_SHEETS_ID!

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function getSheetsClient() {
  const auth = getAuth()
  return google.sheets({ version: 'v4', auth })
}

// --- CONTENT ITEMS ---

export async function getAllContent(status?: string): Promise<ContentItem[]> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_QUEUE}!A2:AC`,
  })
  const rows = res.data.values || []
  const items = rows.map(rowToContentItem).filter(Boolean) as ContentItem[]
  if (status) return items.filter(i => i.status === status)
  return items.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const all = await getAllContent()
  return all.find(i => i.id === id) || null
}

export async function createContent(data: Partial<ContentItem>): Promise<ContentItem> {
  const sheets = await getSheetsClient()
  const id = `JOB_${Date.now()}`
  const now = new Date().toISOString()
  const row = new Array(29).fill('')
  row[COLS.id] = id
  row[COLS.case_name] = data.case_name || ''
  row[COLS.language] = data.language || 'english'
  row[COLS.channel_slot] = String(data.channel_slot || 1)
  row[COLS.content_type] = data.content_type || 'india'
  row[COLS.priority] = String(data.priority || 5)
  row[COLS.notes] = data.notes || ''
  row[COLS.source] = data.source || 'manual'
  row[COLS.status] = 'queued'
  row[COLS.retry_count] = '0'
  row[COLS.rejection_count] = '0'
  row[COLS.scheduled_publish_at] = data.scheduled_publish_at || ''
  row[COLS.created_at] = now
  row[COLS.updated_at] = now

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_QUEUE}!A:AC`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
  return rowToContentItem(row) as ContentItem
}

export async function updateContent(id: string, updates: Partial<ContentItem>): Promise<void> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_QUEUE}!A:A`,
  })
  const ids = (res.data.values || []).map(r => r[0])
  const rowIndex = ids.indexOf(id)
  if (rowIndex === -1) throw new Error(`Content ${id} not found`)
  const sheetRow = rowIndex + 1 // 1-indexed, +1 because header is row 1

  // Get current row data
  const currentRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_QUEUE}!A${sheetRow}:AC${sheetRow}`,
  })
  const current = currentRes.data.values?.[0] || new Array(29).fill('')

  // Apply updates
  const updated = [...current]
  if (updates.status !== undefined)       updated[COLS.status] = updates.status
  if (updates.retry_count !== undefined)  updated[COLS.retry_count] = String(updates.retry_count)
  if (updates.failed_step !== undefined)  updated[COLS.failed_step] = updates.failed_step || ''
  if (updates.error_message !== undefined)updated[COLS.error_message] = updates.error_message || ''
  if (updates.script !== undefined)       updated[COLS.script] = updates.script || ''
  if (updates.voice_url !== undefined)    updated[COLS.voice_url] = updates.voice_url || ''
  if (updates.image_urls !== undefined)   updated[COLS.image_urls] = JSON.stringify(updates.image_urls)
  if (updates.video_url !== undefined)    updated[COLS.video_url] = updates.video_url || ''
  if (updates.yt_title !== undefined)     updated[COLS.yt_title] = updates.yt_title || ''
  if (updates.yt_description !== undefined) updated[COLS.yt_description] = updates.yt_description || ''
  if (updates.yt_tags !== undefined)      updated[COLS.yt_tags] = JSON.stringify(updates.yt_tags)
  if (updates.yt_video_id !== undefined)  updated[COLS.yt_video_id] = updates.yt_video_id || ''
  if (updates.yt_url !== undefined)       updated[COLS.yt_url] = updates.yt_url || ''
  if (updates.scheduled_publish_at !== undefined) updated[COLS.scheduled_publish_at] = updates.scheduled_publish_at || ''
  if (updates.published_at !== undefined) updated[COLS.published_at] = updates.published_at || ''
  if (updates.approval_requested_at !== undefined) updated[COLS.approval_requested_at] = updates.approval_requested_at || ''
  if (updates.approved_at !== undefined)  updated[COLS.approved_at] = updates.approved_at || ''
  if (updates.rejection_reason !== undefined) updated[COLS.rejection_reason] = updates.rejection_reason || ''
  if (updates.rejection_count !== undefined) updated[COLS.rejection_count] = String(updates.rejection_count)
  if (updates.notes !== undefined)        updated[COLS.notes] = updates.notes || ''
  updated[COLS.updated_at] = new Date().toISOString()

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_QUEUE}!A${sheetRow}:AC${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [updated] },
  })
}

// --- LOGS ---

export async function appendLog(log: Omit<ContentLog, 'id' | 'created_at'>): Promise<void> {
  const sheets = await getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_LOGS}!A:G`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        `LOG_${Date.now()}`,
        log.content_id,
        log.step,
        log.status,
        log.message || '',
        log.duration_ms || '',
        new Date().toISOString(),
      ]],
    },
  })
}

export async function getLogsForContent(contentId: string): Promise<ContentLog[]> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_LOGS}!A2:G`,
  })
  return (res.data.values || [])
    .filter(r => r[1] === contentId)
    .map(r => ({
      id: r[0], content_id: r[1], workspace_id: '',
      step: r[2], status: r[3] as any,
      message: r[4], duration_ms: parseInt(r[5]) || undefined,
      created_at: r[6],
    }))
}

// --- PIPELINE CONFIG ---

export async function isPipelinePaused(): Promise<boolean> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_CONFIG}!B1`,
  })
  return res.data.values?.[0]?.[0] === 'true'
}

export async function setPipelinePaused(paused: boolean): Promise<void> {
  const sheets = await getSheetsClient()
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_CONFIG}!B1`,
    valueInputOption: 'RAW',
    requestBody: { values: [[String(paused)]] },
  })
}

// --- HELPER ---

function rowToContentItem(row: string[]): ContentItem | null {
  if (!row || !row[COLS.id]) return null
  return {
    id: row[COLS.id] || '',
    workspace_id: 'default',
    case_name: row[COLS.case_name] || '',
    language: (row[COLS.language] || 'english') as any,
    channel_slot: (parseInt(row[COLS.channel_slot]) || 1) as 1 | 2,
    content_type: (row[COLS.content_type] || 'india') as any,
    priority: parseInt(row[COLS.priority]) || 5,
    notes: row[COLS.notes] || undefined,
    source: (row[COLS.source] || 'manual') as any,
    status: (row[COLS.status] || 'queued') as any,
    retry_count: parseInt(row[COLS.retry_count]) || 0,
    failed_step: row[COLS.failed_step] || undefined,
    error_message: row[COLS.error_message] || undefined,
    script: row[COLS.script] || undefined,
    voice_url: row[COLS.voice_url] || undefined,
    image_urls: row[COLS.image_urls] ? JSON.parse(row[COLS.image_urls]) : undefined,
    video_url: row[COLS.video_url] || undefined,
    yt_title: row[COLS.yt_title] || undefined,
    yt_description: row[COLS.yt_description] || undefined,
    yt_tags: row[COLS.yt_tags] ? JSON.parse(row[COLS.yt_tags]) : undefined,
    yt_video_id: row[COLS.yt_video_id] || undefined,
    yt_url: row[COLS.yt_url] || undefined,
    scheduled_publish_at: row[COLS.scheduled_publish_at] || undefined,
    published_at: row[COLS.published_at] || undefined,
    approval_requested_at: row[COLS.approval_requested_at] || undefined,
    approved_at: row[COLS.approved_at] || undefined,
    rejection_reason: row[COLS.rejection_reason] || undefined,
    rejection_count: parseInt(row[COLS.rejection_count]) || 0,
    created_at: row[COLS.created_at] || new Date().toISOString(),
    updated_at: row[COLS.updated_at] || new Date().toISOString(),
  }
}
