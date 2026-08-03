'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPanel() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetAudience, setTargetAudience] = useState('global')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState(null)
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in AND has the 'admin' role
    const verifyAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUserId(session.user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        // Kick non-admins back to the standard dashboard
        router.push('/dashboard') 
      } else {
        setIsAdmin(true)
      }
    }
    verifyAdminAccess()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { error } = await supabase
        .from('announcements')
        .insert([
          { 
            title, 
            content, 
            target_audience: targetAudience,
            author_id: userId
          }
        ])

      if (error) throw error

      setMessage({ text: 'Announcement posted successfully!', type: 'success' })
      setTitle('')
      setContent('')
      setTargetAudience('global') // Reset to default
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Prevent UI flashing while checking admin status
  if (!isAdmin) {
    return <div className="flex min-h-screen items-center justify-center">Verifying credentials...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h2 className="mb-6 text-xl font-semibold text-gray-700">Create New Announcement</h2>

        {message.text && (
          <div className={`mb-6 rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Announcement Title</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upcoming Hackathon Deadlines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message Content</label>
            <textarea
              required
              rows="5"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full announcement here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-white focus:border-blue-500 focus:outline-none"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="global">Global (All Fellows)</option>
              <option value="software_dev">Software Development</option>
              <option value="data_science">Data Science</option>
              <option value="qa_testing">QA Testing</option>
              <option value="product_management">Product Management</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-800 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>

      </div>
    </div>
  )
}
