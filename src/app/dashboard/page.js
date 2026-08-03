'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        setSession(session)
        fetchProfileAndData(session.user.id)
      }
    }
    checkUser()
  }, [router])

  const fetchProfileAndData = async (userId) => {
    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (profileError) throw profileError
      setProfile(profileData)

      // Fetch Announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (announcementsError) throw announcementsError
      setAnnouncements(announcementsData)

      // Fetch Events (New addition!)
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true }) // Order by upcoming dates
      
      if (eventsError) throw eventsError
      setEvents(eventsData)

    } catch (error) {
      console.error('Error fetching data:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading your workspace...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as: <span className="font-semibold text-blue-600">{session?.user?.email}</span>
            </p>
            <p className="text-sm text-gray-500">
  {profile?.role !== 'admin' && (
    <>
      Track: <span className="uppercase tracking-wider font-semibold">{profile?.track?.replace('_', ' ')}</span> |{' '}
    </>
  )}
  Role: <span className="capitalize">{profile?.role}</span>
</p>
         
          </div>
          <div className="flex space-x-4">
            {profile?.role === 'admin' && (
              <Link href="/admin" className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 transition">
                Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Two-Column Layout for Feed and Events */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Main Feed: Announcements (Takes up 2/3 of space) */}
          <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Recent Announcements</h2>
            
            {announcements.length === 0 ? (
              <p className="text-gray-500 italic">No announcements yet. Check back later!</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((post) => (
                  <div key={post.id} className="rounded-md border border-gray-100 bg-gray-50 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.target_audience === 'global' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {post.target_audience === 'global' ? 'General' : 'Track Specific'}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Posted on {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Events (Takes up 1/3 of space) */}
          <div className="rounded-lg bg-white p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Upcoming Events</h2>
            
            {events.length === 0 ? (
              <p className="text-gray-500 italic">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="rounded-md border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="mt-2 flex items-center text-xs font-bold text-blue-700">
                      📅 {new Date(event.event_date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
