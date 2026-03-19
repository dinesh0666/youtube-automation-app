'use client'

import { useContentList, useContentAction } from '@/hooks/useContent'
import { LANGUAGE_LABELS, CHANNEL_NAMES } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'
import { CheckCircle, XCircle, Edit } from 'lucide-react'

export default function ApprovePage() {
  const { data: content, isLoading } = useContentList('awaiting_approval')

  if (isLoading) {
    return <div className="text-zinc-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Awaiting Approval</h1>
        <p className="text-zinc-400 mt-2">Review and approve videos before publishing</p>
      </div>

      {content && content.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {content.map((item) => (
            <ApprovalCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
          <CheckCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">All Clear!</h3>
          <p className="text-zinc-400">No videos awaiting approval at the moment.</p>
        </div>
      )}
    </div>
  )
}

function ApprovalCard({ item }: { item: any }) {
  const { mutate: performAction, isPending } = useContentAction(item.id)

  const handleApprove = () => {
    if (confirm('Approve this video for publishing?')) {
      performAction({ action: 'approve' })
    }
  }

  const handleReject = () => {
    const reason = prompt('Reason for rejection:')
    if (reason) {
      performAction({ action: 'reject', reason })
    }
  }

  const handleEdit = () => {
    const notes = prompt('What changes would you like to request?')
    if (notes) {
      performAction({ action: 'edit', edit_notes: notes })
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Video Player */}
      {item.video_url && (
        <div className="aspect-video bg-black">
          <video 
            controls 
            className="w-full h-full"
            src={item.video_url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Content Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{item.case_name}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
            <span>{LANGUAGE_LABELS[item.language]}</span>
            <span>•</span>
            <span>{CHANNEL_NAMES[item.channel_slot]}</span>
            <span>•</span>
            <span>{formatRelativeTime(item.approval_requested_at)}</span>
          </div>
        </div>

        {item.yt_title && (
          <div>
            <div className="text-sm text-zinc-400 mb-1">YouTube Title:</div>
            <div className="text-zinc-200">{item.yt_title}</div>
          </div>
        )}

        {item.script && (
          <details className="group">
            <summary className="text-sm text-zinc-400 cursor-pointer hover:text-zinc-300">
              View Script ▼
            </summary>
            <div className="mt-2 text-sm text-zinc-300 bg-zinc-800 p-4 rounded max-h-64 overflow-y-auto">
              {item.script}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={handleEdit}
            disabled={isPending}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Request Edit
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
