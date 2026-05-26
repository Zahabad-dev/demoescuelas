import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nombre =
    user.user_metadata?.nombre ??
    user.user_metadata?.full_name ??
    user.email?.split('@')[0] ??
    'Admin'

  const rol = user.user_metadata?.rol ?? 'admin'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={{ nombre, rol }} />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
