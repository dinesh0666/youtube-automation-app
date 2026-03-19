'use client'

import { useContentList } from '@/hooks/useContent'
import { STATUS_LABELS, STATUS_COLORS, LANGUAGE_LABELS, CHANNEL_NAMES } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

export default function QueuePage() {
  const { data: content, isLoading } = useContentList()

  if (isLoading) {
    return <div className="text-zinc-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Content Queue</h1>
          <p className="text-zinc-400 mt-2">All content items in the pipeline</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add New Content
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800 text-left text-sm">
            <tr>
              <th className="px-6 py-3 font-medium text-zinc-300">ID</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Case Name</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Language</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Channel</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Status</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Created</th>
              <th className="px-6 py-3 font-medium text-zinc-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {content && content.length > 0 ? (
              content.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">
                    {item.id.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/dashboard/item/${item.id}`}
                      className="text-zinc-100 hover:text-red-400 transition-colors font-medium"
                    >
                      {item.case_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">
                      {LANGUAGE_LABELS[item.language]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {CHANNEL_NAMES[item.channel_slot]}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]} text-white`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {formatRelativeTime(item.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/dashboard/item/${item.id}`}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                  No content items yet. Add your first case to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
