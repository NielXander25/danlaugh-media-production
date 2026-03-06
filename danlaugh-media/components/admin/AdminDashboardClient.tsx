'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Film, Quote, User, LogOut, Menu, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import AdminProjects from '@/components/admin/AdminProjects'
import AdminTestimonials from '@/components/admin/AdminTestimonials'
import AboutImageManager from '@/components/admin/AboutImageManager'

type Tab = 'projects' | 'testimonials' | 'about'

const tabs = [
  { id: 'projects' as Tab, label: 'Projects', icon: Film },
  { id: 'testimonials' as Tab, label: 'Testimonials', icon: Quote },
  { id: 'about' as Tab, label: 'About Image', icon: User },
]

interface Props {
  userEmail: string
}

export default function AdminDashboardClient({ userEmail }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-bg-secondary border-r border-white/8 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/8">
          <div className="font-display font-bold text-white text-base">Danlaugh Media</div>
          <div className="text-text-secondary text-xs mt-0.5">Admin Dashboard</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-left transition-all duration-200 admin-nav-item ${
                activeTab === id
                  ? 'active bg-accent/10 text-accent-hover border-l-2 border-accent'
                  : 'text-text-secondary border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} />
              {label}
              {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/8 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white rounded-sm transition-colors"
          >
            <Home size={16} />
            View Site
          </Link>
          <div className="px-4 py-2 text-xs text-text-secondary truncate">{userEmail}</div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-red-400 rounded-sm transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8 bg-bg-secondary">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-text-secondary hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-display font-semibold text-white">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
        </header>

        {/* Tab content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'projects'     && <AdminProjects />}
            {activeTab === 'testimonials' && <AdminTestimonials />}
            {activeTab === 'about'        && <AboutImageManager />}
          </motion.div>
        </div>
      </main>
    </div>
  )
}