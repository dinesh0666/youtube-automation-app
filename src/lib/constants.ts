export const STATUS_LABELS: Record<string, string> = {
  queued: 'Queued',
  researching: 'Researching',
  scripting: 'Scripting',
  reviewing: 'AI Review',
  voicing: 'Voiceover',
  imaging: 'Generating images',
  rendering: 'Rendering video',
  awaiting_approval: 'Awaiting approval',
  publishing: 'Publishing',
  scheduled: 'Scheduled',
  published: 'Published',
  tracking: 'Tracking',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-zinc-500',
  researching: 'bg-blue-500',
  scripting: 'bg-blue-600',
  reviewing: 'bg-cyan-500',
  voicing: 'bg-violet-500',
  imaging: 'bg-violet-600',
  rendering: 'bg-amber-500',
  awaiting_approval: 'bg-yellow-500',
  publishing: 'bg-orange-500',
  scheduled: 'bg-teal-500',
  published: 'bg-green-500',
  tracking: 'bg-green-600',
  failed: 'bg-red-600',
  cancelled: 'bg-zinc-600',
}

export const PIPELINE_STEPS = [
  { key: 'queued',             label: 'Queued',           icon: 'Clock' },
  { key: 'researching',        label: 'Research',         icon: 'Search' },
  { key: 'scripting',          label: 'Script',           icon: 'FileText' },
  { key: 'reviewing',          label: 'AI Review',        icon: 'ShieldCheck' },
  { key: 'voicing',            label: 'Voiceover',        icon: 'Mic' },
  { key: 'imaging',            label: 'Images',           icon: 'Image' },
  { key: 'rendering',          label: 'Video render',     icon: 'Video' },
  { key: 'awaiting_approval',  label: 'Your approval',    icon: 'CheckCircle' },
  { key: 'publishing',         label: 'Publishing',       icon: 'Upload' },
  { key: 'published',          label: 'Live on YouTube',  icon: 'Youtube' },
]

export const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  tamil: 'Tamil',
  hindi: 'Hindi',
}

export const LANGUAGE_COLORS: Record<string, string> = {
  english: 'bg-red-900 text-red-300',
  tamil: 'bg-violet-900 text-violet-300',
  hindi: 'bg-orange-900 text-orange-300',
}

export const CHANNEL_NAMES: Record<number, string> = {
  1: 'Dark Files',
  2: 'Kutram Kopukal',
}
