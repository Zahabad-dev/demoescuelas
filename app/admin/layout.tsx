import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={{ nombre: user.nombre, rol: user.rol }} />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
