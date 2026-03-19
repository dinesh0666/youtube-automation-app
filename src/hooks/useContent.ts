'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ContentItem, ApprovalAction } from '@/lib/types'

export function useContentList(status?: string) {
  return useQuery({
    queryKey: ['content', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const res = await fetch(`/api/content${params}`)
      if (!res.ok) throw new Error('Failed to fetch content')
      return res.json() as Promise<ContentItem[]>
    },
    refetchInterval: 30000,
  })
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const res = await fetch(`/api/content/${id}`)
      if (!res.ok) throw new Error('Failed to fetch content item')
      return res.json()
    },
  })
}

export function useContentAction(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (action: ApprovalAction) => {
      const res = await fetch(`/api/content/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      if (!res.ok) throw new Error('Action failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}

export function useCreateContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      case_name: string
      language: string
      channel_slot: number
      content_type: string
      notes?: string
      scheduled_publish_at?: string
    }) => {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create content')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
