// components/JobManagementActions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateJobStatus, deleteJobPost } from '@/app/actions/client'

export default function JobManagementActions({ 
  jobId, 
  status 
}: { 
  jobId: string
  status: string 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleMarkFilled = async () => {
    if (!confirm('Mark this job as filled? This will hide it from workers.')) return
    
    setLoading(true)
    const result = await updateJobStatus(jobId, 'filled')
    
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  const handleReopen = async () => {
    setLoading(true)
    const result = await updateJobStatus(jobId, 'open')
    
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteJobPost(jobId)
    
    if (result.error) {
      alert(result.error)
      setLoading(false)
    } else {
      router.push('/client/jobs')
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2">
        {status === 'open' && (
          <button
            onClick={handleMarkFilled}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Mark as Filled
          </button>
        )}
        
        {status === 'filled' && (
          <button
            onClick={handleReopen}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Reopen Job
          </button>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold text-sm transition-colors border border-red-200"
          >
            Delete Job
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}