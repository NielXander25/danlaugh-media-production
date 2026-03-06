// Server Component — auth check runs server-side before ANY HTML reaches the browser.
// Next.js `redirect()` here is a hard 307 — the client never sees the dashboard.
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
    return null
  }

  return <AdminDashboardClient userEmail={user.email ?? ''} />
}