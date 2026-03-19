export type ContentStatus =
  | 'queued'
  | 'researching'
  | 'scripting'
  | 'reviewing'
  | 'voicing'
  | 'imaging'
  | 'rendering'
  | 'awaiting_approval'
  | 'publishing'
  | 'scheduled'
  | 'published'
  | 'tracking'
  | 'failed'
  | 'cancelled'

export type Language = 'english' | 'tamil' | 'hindi'
export type ContentType = 'india' | 'international'
export type UserRole = 'owner' | 'editor' | 'reviewer'
export type WorkspacePlan = 'free' | 'pro' | 'business'
export type LogStatus = 'started' | 'completed' | 'failed' | 'skipped'
export type ContentSource = 'manual' | 'ai_researcher' | 'api'

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  plan: WorkspacePlan
  claude_api_key?: string
  elevenlabs_api_key?: string
  elevenlabs_voice_en?: string
  elevenlabs_voice_ta?: string
  leonardo_api_key?: string
  shotstack_api_key?: string
  perplexity_api_key?: string
  yt_refresh_token_1?: string
  yt_refresh_token_2?: string
  yt_channel_id_1?: string
  yt_channel_id_2?: string
  telegram_bot_token?: string
  telegram_chat_id?: string
  auto_approve: boolean
  daily_video_limit: number
  default_language: Language
  created_at: string
}

export interface ContentItem {
  id: string
  workspace_id: string
  case_name: string
  language: Language
  channel_slot: 1 | 2
  content_type: ContentType
  priority: number
  notes?: string
  source: ContentSource
  status: ContentStatus
  retry_count: number
  failed_step?: string
  error_message?: string
  case_research?: Record<string, unknown>
  script?: string
  image_prompts?: string[]
  voice_url?: string
  image_urls?: string[]
  video_url?: string
  thumbnail_text?: string
  yt_title?: string
  yt_description?: string
  yt_tags?: string[]
  yt_video_id?: string
  yt_url?: string
  scheduled_publish_at?: string
  published_at?: string
  approval_requested_at?: string
  approved_at?: string
  approved_by?: string
  rejection_reason?: string
  rejection_count: number
  views_total?: number
  watch_hours_total?: number
  estimated_revenue_usd?: number
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface ContentLog {
  id: string
  content_id: string
  workspace_id: string
  step: string
  status: LogStatus
  message?: string
  metadata?: Record<string, unknown>
  duration_ms?: number
  created_at: string
}

export interface CalendarItem {
  id: string
  workspace_id: string
  content_id: string
  case_name: string
  language: Language
  scheduled_date: string
  time_slot: string
  status: ContentStatus
  sheet_row_index?: number
}

export interface UsageEvent {
  id: string
  workspace_id: string
  event_type: string
  api_provider: string
  units: number
  cost_usd: number
  created_at: string
}

export interface WorkspaceConfig {
  workspace_id: string
  pipeline_paused: boolean
  max_concurrent_jobs: number
  updated_at: string
}

export interface ApprovalAction {
  action: 'approve' | 'reject' | 'edit' | 'cancel' | 'retry'
  reason?: string
  edit_notes?: string
}

export interface N8nWebhookPayload {
  content_id: string
  workspace_id: string
  step: string
  status: LogStatus
  message?: string
  duration_ms?: number
  data?: Partial<ContentItem>
}
