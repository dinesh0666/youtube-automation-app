'use client'

import { useContentList } from '@/hooks/useContent'
import { STATUS_LABELS, STATUS_COLORS, LANGUAGE_LABELS } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'
import { AlertCircle, Clock, CheckCircle, Youtube } from 'lucide-react'

export default function DashboardPage() {
  const { data: allContent, isLoading } = useContentList()
  const { data: awaitingApproval } = useContentList('awaiting_approval')

  if (isLoading) {
    return <div className="text-zinc-400">Loading...</div>
  }

  const queued = allContent?.filter(item => item.status === 'queued').length || 0
  const published = allContent?.filter(item => item.status === 'published').length || 0
  const failed = allContent?.filter(item => item.status === 'failed').length || 0
  const awaitingCount = awaitingApproval?.length || 0

  const recentJobs = allContent?.slice(0, 10) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Monitor your AI video production pipeline</p>
      </div>

      {/* Alert if awaiting approval */}
      {awaitingCount > 0 && (
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-500">Videos Awaiting Approval</h3>
            <p className="text-sm text-zinc-300 mt-1">
              {awaitingCount} video{awaitingCount > 1 ? 's' : ''} ready for your review
            </p>
            <a 
              href="/dashboard/approve" 
              className="text-red-400 hover:text-red-300 text-sm font-medium mt-2 inline-block"
            >
              Review now →
            </a>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Queued"
          value={queued}
          color="text-zinc-400"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Awaiting Approval"
          value={awaitingCount}
          color="text-yellow-500"
        />
        <StatCard
          icon={<Youtube className="w-6 h-6" />}
          label="Published"
          value={published}
          color="text-green-500"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Failed"
          value={failed}
          color="text-red-500"
        />
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Recent Jobs</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800 text-left text-sm">
              <tr>
                <th className="px-6 py-3 font-medium text-zinc-300">Case Name</th>
                <th className="px-6 py-3 font-medium text-zinc-300">Language</th>
                <th className="px-6 py-3 font-medium text-zinc-300">Status</th>
                <th className="px-6 py-3 font-medium text-zinc-300">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <a 
                      href={`/dashboard/item/${job.id}`}
                      className="text-zinc-100 hover:text-red-400 transition-colors"
                    >
                      {job.case_name}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">
                      {LANGUAGE_LABELS[job.language]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status]} text-white`}>
                      {STATUS_LABELS[job.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {formatRelativeTime(job.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className={color}>{icon}</div>
        <div className="text-right">
          <div className="text-3xl font-bold text-zinc-100">{value}</div>
          <div className="text-sm text-zinc-400 mt-1">{label}</div>
        </div>
      </div>
    </div>
  )
}
