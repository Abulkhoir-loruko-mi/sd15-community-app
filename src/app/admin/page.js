// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '../utils/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function AdminPanel() {
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [targetAudience, setTargetAudience] = useState('global')
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState({ text: '', type: '' })
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [userId, setUserId] = useState(null)
  
//   const router = useRouter()

//   useEffect(() => {
//     // Check if user is logged in AND has the 'admin' role
//     const verifyAdminAccess = async () => {
//       const { data: { session } } = await supabase.auth.getSession()
      
//       if (!session) {
//         router.push('/login')
//         return
//       }

//       setUserId(session.user.id)

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', session.user.id)
//         .single()

//       if (profile?.role !== 'admin') {
//         // Kick non-admins back to the standard dashboard
//         router.push('/dashboard') 
//       } else {
//         setIsAdmin(true)
//       }
//     }
//     verifyAdminAccess()
//   }, [router])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage({ text: '', type: '' })

//     try {
//       const { error } = await supabase
//         .from('announcements')
//         .insert([
//           { 
//             title, 
//             content, 
//             target_audience: targetAudience,
//             author_id: userId
//           }
//         ])

//       if (error) throw error

//       setMessage({ text: 'Announcement posted successfully!', type: 'success' })
//       setTitle('')
//       setContent('')
//       setTargetAudience('global') // Reset to default
//     } catch (error) {
//       setMessage({ text: `Error: ${error.message}`, type: 'error' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Prevent UI flashing while checking admin status
//   if (!isAdmin) {
//     return <div className="flex min-h-screen items-center justify-center">Verifying credentials...</div>
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        
//         <div className="mb-8 flex items-center justify-between border-b pb-4">
//           <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
//           <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
//             &larr; Back to Dashboard
//           </Link>
//         </div>

//         <h2 className="mb-6 text-xl font-semibold text-gray-700">Create New Announcement</h2>

//         {message.text && (
//           <div className={`mb-6 rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Announcement Title</label>
//             <input
//               type="text"
//               required
//               className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., Upcoming Hackathon Deadlines"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Message Content</label>
//             <textarea
//               required
//               rows="5"
//               className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Write the full announcement here..."
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Target Audience</label>
//             <select
//               className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-white focus:border-blue-500 focus:outline-none"
//               value={targetAudience}
//               onChange={(e) => setTargetAudience(e.target.value)}
//             >
//               <option value="global">Global (All Fellows)</option>
//               <option value="software_dev">Software Development</option>
//               <option value="data_science">Data Science</option>
//               <option value="qa_testing">QA Testing</option>
//               <option value="product_management">Product Management</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-md bg-gray-800 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
//           >
//             {loading ? 'Publishing...' : 'Publish Announcement'}
//           </button>
//         </form>

//       </div>
//     </div>
//   )
// }






'use client'

import { useEffect, useState } from 'react'
//import { supabase } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// import { useEffect, useState } from 'react'
 import { supabase } from '../utils/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

export default function AdminPanel() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetAudience, setTargetAudience] = useState('global')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState(null)
  
  // New state variables for editing and listing
  const [announcements, setAnnouncements] = useState([])
  const [editingId, setEditingId] = useState(null)
  
  const router = useRouter()

  useEffect(() => {
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
        router.push('/dashboard') 
      } else {
        setIsAdmin(true)
        fetchAnnouncements() // Load existing posts when page loads
      }
    }
    verifyAdminAccess()
  }, [router])

  // Fetch all announcements for the admin to manage
  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAnnouncements(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      if (editingId) {
        // UPDATE existing post
        const { error } = await supabase
          .from('announcements')
          .update({ title, content, target_audience: targetAudience })
          .eq('id', editingId)

        if (error) throw error
        setMessage({ text: 'Announcement updated successfully!', type: 'success' })
      } else {
        // INSERT new post
        const { error } = await supabase
          .from('announcements')
          .insert([{ title, content, target_audience: targetAudience, author_id: userId }])

        if (error) throw error
        setMessage({ text: 'Announcement posted successfully!', type: 'success' })
      }

      // Clear the form and refresh the list
      cancelEdit()
      fetchAnnouncements()
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Populate form with post data
  const handleEdit = (post) => {
    setEditingId(post.id)
    setTitle(post.title)
    setContent(post.content)
    setTargetAudience(post.target_audience)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset form
  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setTargetAudience('global')
  }

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchAnnouncements() // Refresh the list
    } catch (error) {
      alert('Error deleting post: ' + error.message)
    }
  }

  if (!isAdmin) {
    return <div className="flex min-h-screen items-center justify-center">Verifying credentials...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Form Section */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
              &larr; Back to Dashboard
            </Link>
          </div>

          <h2 className="mb-6 text-xl font-semibold text-gray-700">
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>

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

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-gray-800 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingId ? 'Update Announcement' : 'Publish Announcement'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full rounded-md bg-red-100 py-3 text-red-700 font-medium hover:bg-red-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Management Section */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-700 border-b pb-4">Manage Existing Announcements</h2>
          
          {announcements.length === 0 ? (
            <p className="text-gray-500 italic">No announcements posted yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((post) => (
                <div key={post.id} className="flex flex-col md:flex-row md:items-center justify-between rounded-md border border-gray-200 p-4">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-semibold text-gray-800">{post.title}</h3>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{post.target_audience.replace('_', ' ')}</span>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

