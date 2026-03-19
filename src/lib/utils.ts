import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'dd MMM yyyy, h:mm a')
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'dd MMM yyyy')
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

export function getStepIndex(status: string): number {
  const steps = [
    'queued','researching','scripting','voicing',
    'imaging','rendering','awaiting_approval',
    'publishing','published'
  ]
  return steps.indexOf(status)
}

export function isTerminalStatus(status: string): boolean {
  return ['published', 'failed', 'cancelled'].includes(status)
}

export function canApprove(status: string): boolean {
  return status === 'awaiting_approval'
}

export function canRetry(status: string): boolean {
  return status === 'failed'
}
