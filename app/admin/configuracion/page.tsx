import { Settings, Database, Key, Bot } from 'lucide-react'

export default function ConfiguracionPage() {
  const items = [
    {
      icon: Database,
      title: 'Base de datos',
      desc: 'Conectada a Supabase. Tablas: alumnos, padres, pagos.',
      status: 'ok',
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? '✓ NEXT_PUBLIC_SUPABASE_URL configurada'
        : '⚠ NEXT_PUBLIC_SUPABASE_URL no configurada (modo demo)',
    },
    {
      icon: Key,
      title: 'Autenticación',
      desc: 'Supabase Auth — email/password. Usuarios en Authentication → Users.',
      status: 'ok',
      detail: 'Sesión manejada por @supabase/ssr con cookies httpOnly',
    },
    {
      icon: Bot,
      title: 'Endpoint de chatbot',
      desc: 'API pública con información completa del instituto.',
      status: 'ok',
      detail: '/api/bot/escuela — acceso libre, sin auth',
    },
    {
      icon: Settings,
      title: 'n8n',
      desc: 'Acceso directo a Supabase para automatizaciones de cobro.',
      status: 'info',
      detail: 'Usar nodo Supabase (URL + Service Role Key) o nodo Postgres con la cadena de conexión directa del proyecto.',
    },
  ]

  return (
    <div>
      <div className="mb-8 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm mt-0.5">Estado del sistema y conexiones</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {items.map(({ icon: Icon, title, desc, detail }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">{desc}</p>
            <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-xs text-gray-600 font-mono">{detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
