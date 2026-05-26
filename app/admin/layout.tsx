import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) redirect('/login')

  let user = { nombre: 'Admin', rol: 'admin' }
  try {
    const payload = await verifyToken(token)
    user = { nombre: payload.nombre, rol: payload.rol }
  } catch {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={user} />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
